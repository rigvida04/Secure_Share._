// Client-side encryption utilities using Web Crypto API

class CryptoHelper {
    constructor() {
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
    }

    // Generate a key from password
    async deriveKey(password, salt) {
        const passwordKey = await window.crypto.subtle.importKey(
            'raw',
            this.encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );

        return window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            passwordKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    // Encrypt data
    async encrypt(data, password) {
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await this.deriveKey(password, salt);

        const encryptedData = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            typeof data === 'string' ? this.encoder.encode(data) : data
        );

        // Combine salt, iv, and encrypted data
        const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

        return combined;
    }

    // Decrypt data
    async decrypt(encryptedData, password) {
        const data = new Uint8Array(encryptedData);
        const salt = data.slice(0, 16);
        const iv = data.slice(16, 28);
        const encrypted = data.slice(28);

        const key = await this.deriveKey(password, salt);

        try {
            const decrypted = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encrypted
            );
            return decrypted;
        } catch (error) {
            throw new Error('Decryption failed. Wrong password?');
        }
    }

    // Encrypt text
    async encryptText(text, password) {
        const encrypted = await this.encrypt(text, password);
        return this.arrayBufferToBase64(encrypted);
    }

    // Decrypt text
    async decryptText(encryptedBase64, password) {
        const encrypted = this.base64ToArrayBuffer(encryptedBase64);
        const decrypted = await this.decrypt(encrypted, password);
        return this.decoder.decode(decrypted);
    }

    // Helper: ArrayBuffer to Base64
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    // Helper: Base64 to ArrayBuffer
    base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // Encrypt file
    async encryptFile(file, password) {
        const arrayBuffer = await file.arrayBuffer();
        const encrypted = await this.encrypt(arrayBuffer, password);
        return new Blob([encrypted], { type: 'application/octet-stream' });
    }

    // Decrypt file
    async decryptFile(encryptedBlob, password, originalType) {
        const arrayBuffer = await encryptedBlob.arrayBuffer();
        const decrypted = await this.decrypt(arrayBuffer, password);
        return new Blob([decrypted], { type: originalType || 'application/octet-stream' });
    }
}

// Create global instance
window.cryptoHelper = new CryptoHelper();
