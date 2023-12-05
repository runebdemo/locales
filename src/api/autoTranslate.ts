import OpenAI from 'openai'
import {buildResourceBundle} from '../api/builders/buildResourceBundle'
import {findMissingResources} from '../api/resources'
import type {Resource} from '../types'
import {getOrderedResources} from '../util/getOrderedResources'
import {writeFormattedFile} from '../util/writeFormattedFile'

const OPENAI_MODEL = 'gpt-4-1106-preview'

/**
 * Automatically translate missing resources using AI.
 * Writes back the translations to namespace files on success.
 *
 * @returns A promise that resolves when all resources have been translated
 * @internal
 */
export async function autoTranslate(): Promise<void> {
  const {locales} = await getOrderedResources()
  for await (const locale of locales) {
    const missingResources = await findMissingResources(locale)
    for await (const entry of missingResources) {
      console.log(
        `Found ${entry.missingKeys.length} missing resources for ${locale.name} in ${entry.namespace}`,
      )
      const ns = locale.namespaces.find((namespace) => namespace.namespace === entry.namespace)
      if (!ns) {
        console.log(`Could not find namespace ${entry.namespace} in locale ${locale.name}`)
        continue
      }

      // Group entry.missingKeys into max 25 keys per request
      const BATCH_SIZE = 25
      const batches = []
      let batch = []
      for (const key of entry.missingKeys) {
        if (batch.length === BATCH_SIZE) {
          batches.push(batch)
          batch = []
        }
        batch.push(key)
      }

      if (batch.length > 0) {
        batches.push(batch)
      }

      // For each of the batches, translate the keys
      for await (const currentBatch of batches) {
        const keys = currentBatch.map((key) => key.key)
        const tpl = templateMissingResources(ns.indexedResources, currentBatch)
        /* eslint-disable no-console */
        console.debug(tpl)
        /* eslint-disable no-console */
        console.log(
          `[${locale.name}] Translating ${batches.indexOf(currentBatch) + 1}/${batches.length} key batches for namespace ${ns.namespace}`,
        )
        const translation = JSON.parse(await translateText(tpl, locale.name))

        // Set the values from translation into the namespace
        keys.forEach((key) => {
          const val = ns.indexedResources[key]
          if (val) {
            val.value = translation[key]
          }
        })

        // Set the values from translation into the namespace
        entry.missingKeys.forEach((key) => {
          const val = ns.indexedResources[key.key]
          if (val) {
            val.value = translation[key.key]
          }
        })

        // Write the bundle back to disk, to save our progress
        for await (const {filePath, resources} of locale.namespaces) {
          const moduleCode = buildResourceBundle(resources)
          await writeFormattedFile(filePath, moduleCode)
        }
      }
    }
  }
}

/**
 * Takes existing resources, missing key names and generates a template for the AI to translate.
 * Expects the missing keys to already have values in indexedResources.
 *
 * @param indexedResources - Base resources, eg english variants
 * @param missingKeys - The keys that are missing from the target locale
 * @returns A template string that can be translated
 */
function templateMissingResources(
  indexedResources: Record<string, Resource | undefined>,
  missingKeys: {key: string; pluralizable: boolean}[],
): string {
  let tpl = `// English base translation\n`
  tpl += `const i18nextKeys = {\n`
  missingKeys.forEach((entry) => {
    const val = indexedResources[entry.key]
    if (val) {
      tpl += `  // ${val.comments}\n`
      tpl += `  ${JSON.stringify(entry.key)}: ${JSON.stringify(val.baseValue)},\n`
    }
  })
  tpl += `};\n`
  return tpl
}

/**
 * Translate the given text to the given target language, returning JSON
 *
 * @param text
 * @param targetLanguage
 * @returns
 */
async function translateText(text: string, targetLanguage: string): Promise<string> {
  // Note: will thrown on missing environment variable
  const openai = new OpenAI()

  if (text.trim() === '') {
    return JSON.stringify({})
  }

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: getSystemPrompt(),
      },
      {
        role: 'user',
        content: `I would like this translated to ${targetLanguage}. Respond with JSON:`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    model: OPENAI_MODEL,
    stream: false,
    temperature: 0,
    // eslint-disable-next-line camelcase
    response_format: {
      type: 'json_object',
    },
  })

  return chatCompletion.choices[0].message.content || ''
}

/**
 * Get the system prompt for the AI to translate our source code and return JSON.
 *
 * @returns The system prompt
 * @internal
 */
function getSystemPrompt(): string {
  return `You are a helpful translation assistant. Your job is to
receive source code files and translate the values within, and return the exact same
file back to the user, with the translations included. The user will give you a
segment from a typescript file representing i18next resource bundles. Preserve
exactly the source code, english comments and keys. Do not translate any of
those. You WILL translate the values of the keys into the requested target
language. Respond with valid JSON, keeping it EXACTLY the same as given to you,
except your translation. If there is nothing to translate, just return the input
back. Your output will be read programmatically by a node script so it is very
important that you do not change its structure at all, except translation of the
value strings. The values may contain branded feature names of the Sanity.io
platform, such as "dataset", "webhook", "GROQ", "perspective", "Content Lake"
etc. Do not translate any words and terms that are Sanity.io product features as
it is important that the branding is preserved.`
}
