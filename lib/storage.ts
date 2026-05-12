import { createClient } from './supabase'
const supabase = createClient()

/**
 * Returns existing file names in a documents bucket path
 * Example paths:
 *  - tier-1-policies
 *  - tier-3-procedures/human-resource
 */
export async function listExistingNames(path: string): Promise<string[]> {
  const { data, error } = await supabase
    .storage
    .from('documents')
    .list(path, { limit: 1000 })

  if (error) {
    console.error('Error listing storage path:', error.message)
    return []
  }

  return (data || [])
    .filter(item => item.metadata !== null) // files only (not folders)
    .map(item => item.name)
}
``