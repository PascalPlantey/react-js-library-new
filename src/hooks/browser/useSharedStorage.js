import { useCallback, useEffect, useState } from 'react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

import useBoolean from '../utils/useBoolean';

// Crypto utility functions using AES-256-GCM
const deriveKey = async (password) => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('useSharedStorage'), // Fixed salt for consistency
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

const encryptData = async (data, password) => {
  if (!password)
    throw new Error('useSharedStorage: Encryption key is required');
  
  try {
    const key = await deriveKey(password);
    const encoder = new TextEncoder();
    const jsonString = JSON.stringify(data);
    
    // Generate a random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(jsonString)
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);
    
    // Base64 encode the result
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
};

const decryptData = async (encryptedData, password) => {
  if (!password)
    throw new Error('useSharedStorage: Decryption key is required');
  
  try {
    const key = await deriveKey(password);
    
    // Base64 decode
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedData);
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
};

/**
 * Custom React hook for shared storage with optional encryption.
 * 
 * This hook reads and writes data to a file in the device's Documents directory,
 * optionally encrypting and decrypting the data using a provided encryption key.
 * It automatically initializes the file with a default value if it does not exist.
 * 
 * @param {string} fileName - The name of the file to use for storage.
 * @param {*} defaultValue - The default value to use if the file does not exist or decryption fails.
 * @param {string} [encryptionKey] - Optional encryption key for encrypting/decrypting the stored data.
 * @returns {[any, function(any): Promise<void>, boolean]} 
 *   Returns a tuple containing:
 *     - The current value from storage.
 *     - An async function to update the value in storage.
 *     - A boolean indicating if the value is still loading.
 * 
 * @example
 * const [data, setData, loading] = useSharedStorage('settings.json', { theme: 'dark' }, 'my-secret-key');
 * 
 * @remarks
 * This hook requires Capacitor's Filesystem API to read and write files (`@capacitor/filesystem`)
 */
const useSharedStorage = (fileName, defaultValue, encryptionKey) => {
  const [value, setValue] = useState(defaultValue);
  const { value : loading, setValue: setLoading } = useBoolean(true);

  // Helper function to write file
  const writeFile = useCallback(async (data) => {
    const encryptedData = encryptionKey ? await encryptData(data, encryptionKey) : JSON.stringify(data);
    await Filesystem.writeFile({
      path: fileName,
      data: encryptedData,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });
  }, [fileName, encryptionKey]);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const file = await Filesystem.readFile({
          path: fileName,
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        });
        const decryptedData = encryptionKey ? await decryptData(file.data, encryptionKey) : JSON.parse(file.data);
        setValue(decryptedData);
      } catch {
        // File doesn't exist or decryption failed, create it with default values
        await writeFile(defaultValue);
        setValue(defaultValue);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [fileName, defaultValue, writeFile, setLoading, encryptionKey]);

  const updateValue = useCallback(async (newValue) => {
    try {
      await writeFile(newValue);
      setValue(newValue);
    } catch (error) {
      console.error('Failed to update shared storage:', error);
      throw error;
    }
  }, [writeFile]);

  return [value, updateValue, loading];
};

export default useSharedStorage;
