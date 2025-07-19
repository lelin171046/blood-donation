import axios from "axios"

// ImgBB API configuration
const IMGBB_API_KEY = "2e41f7bbdb682909d4bdf7411087cbd0" // Your API key
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload"

/**
 * Upload image to ImgBB
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - Returns the image URL
 */
export const uploadToImgBB = async (file) => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided")
    }

    // Check file size (ImgBB has a 32MB limit for free accounts)
    if (file.size > 32 * 1024 * 1024) {
      throw new Error("File size too large. Maximum size is 32MB.")
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image")
    }

    // Convert file to base64
    const base64 = await convertFileToBase64(file)

    // Create form data
    const formData = new FormData()
    formData.append("key", IMGBB_API_KEY)
    formData.append("image", base64.split(",")[1]) // Remove data:image/jpeg;base64, prefix

    // Upload to ImgBB
    const response = await axios.post(IMGBB_UPLOAD_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    if (response.data.success) {
      return {
        url: response.data.data.url,
        deleteUrl: response.data.data.delete_url,
        displayUrl: response.data.data.display_url,
        thumbUrl: response.data.data.thumb?.url,
      }
    } else {
      throw new Error("Upload failed")
    }
  } catch (error) {
    console.error("ImgBB upload error:", error)

    // Handle specific ImgBB errors
    if (error.response?.data?.error?.message) {
      throw new Error(`ImgBB Error: ${error.response.data.error.message}`)
    }

    throw error
  }
}

/**
 * Convert file to base64
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string
 */
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Alternative method using direct binary upload
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - Returns the image URL
 */
export const uploadToImgBBBinary = async (file) => {
  try {
    if (!file) {
      throw new Error("No file provided")
    }

    const formData = new FormData()
    formData.append("key", IMGBB_API_KEY)
    formData.append("image", file) // Direct file upload

    const response = await axios.post(IMGBB_UPLOAD_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    if (response.data.success) {
      return {
        url: response.data.data.url,
        deleteUrl: response.data.data.delete_url,
        displayUrl: response.data.data.display_url,
        thumbUrl: response.data.data.thumb?.url,
      }
    } else {
      throw new Error("Upload failed")
    }
  } catch (error) {
    console.error("ImgBB binary upload error:", error)
    throw error
  }
}

/**
 * Delete image from ImgBB (if you have the delete URL)
 * @param {string} deleteUrl - The delete URL returned from upload
 */
export const deleteFromImgBB = async (deleteUrl) => {
  try {
    await axios.delete(deleteUrl)
    return true
  } catch (error) {
    console.error("ImgBB delete error:", error)
    throw error
  }
}
