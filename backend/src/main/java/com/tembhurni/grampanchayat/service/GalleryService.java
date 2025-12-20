package com.tembhurni.grampanchayat.service;

import com.tembhurni.grampanchayat.model.FileType;
import com.tembhurni.grampanchayat.model.GalleryItem;
import com.tembhurni.grampanchayat.repository.GalleryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class GalleryService {

    @Autowired
    private GalleryItemRepository galleryItemRepository;

    /**
     * Base directory for storing gallery files
     * Local: ./uploads
     * Render: /data/gallery
     */
    @Value("${gallery.storage.path:./uploads}")
    private String galleryStoragePath;

    /**
     * Upload a new gallery item and store file on disk + metadata in database
     *
     * @param file The uploaded file
     * @param category Category of the item (e.g., "gramsabha", "festival")
     * @param title Title/name of the item
     * @param year Year of the item
     * @param month Month of the item
     * @param type FileType enum (IMAGE, VIDEO, PDF)
     * @return Saved GalleryItem with metadata
     * @throws IOException if file save fails
     */
    @Transactional
    public GalleryItem uploadItem(
            MultipartFile file,
            String category,
            String title,
            Integer year,
            String month,
            FileType type) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Ensure base directory exists
        Path baseDir = Paths.get(galleryStoragePath);
        Files.createDirectories(baseDir);

        // Generate unique filename to avoid collisions
        String originalName = file.getOriginalFilename();
        String ext = "";
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf('.'));
        }
        String uniqueName = UUID.randomUUID().toString() + ext;
        Path targetPath = baseDir.resolve(uniqueName);

        // Save file to disk
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Create and persist GalleryItem metadata to database
        GalleryItem item = new GalleryItem();
        item.setTitle(title);
        item.setCategory(category.toLowerCase());
        item.setYear(year);
        item.setMonth(month.toLowerCase());
        item.setUploadTimestamp(LocalDateTime.now());
        item.setType(type);
        item.setContentType(file.getContentType());

        // Store relative path (used to load file from disk later)
        item.setFileUrl("/gallery/" + uniqueName);

        // Don't store binary in database when using disk storage
        item.setFileData(null);

        // Save to database
        return galleryItemRepository.save(item);
    }

    /**
     * Get all items of a specific category, ordered by ID ascending
     */
    public List<GalleryItem> getItemsByCategory(String category) {
        return galleryItemRepository.findByCategoryOrderByIdAsc(category.toLowerCase());
    }

    /**
     * Get the most recent items (by ID descending)
     *
     * @param count Maximum number of items to return
     * @return List of recent items
     */
    public List<GalleryItem> getRecentItems(int count) {
        List<GalleryItem> allItemsAsc = galleryItemRepository.findAllByOrderByIdAsc();

        if (allItemsAsc.size() <= count) {
            return allItemsAsc;
        }

        // Return last 'count' items (most recent)
        return allItemsAsc.subList(allItemsAsc.size() - count, allItemsAsc.size());
    }

    /**
     * Get a single gallery item by ID
     */
    public GalleryItem getItemById(Long id) {
        return galleryItemRepository.findById(id).orElse(null);
    }

    /**
     * Load file bytes from disk for a given GalleryItem
     *
     * @param item The GalleryItem containing fileUrl
     * @return Byte array of the file, or null if file not found
     * @throws IOException if file read fails
     */
    public byte[] loadFileBytes(GalleryItem item) throws IOException {
        if (item == null || item.getFileUrl() == null) {
            return null;
        }

        // Extract filename from fileUrl (e.g., /gallery/uuid.ext -> uuid.ext)
        String filename = item.getFileUrl().replaceFirst("^/gallery/", "");
        Path baseDir = Paths.get(galleryStoragePath);
        Path filePath = baseDir.resolve(filename);

        // Check if file exists
        if (!Files.exists(filePath)) {
            return null;
        }

        // Read and return file bytes
        return Files.readAllBytes(filePath);
    }

    /**
     * Delete a gallery item and its associated file from disk
     * Removes both the database record and the physical file
     *
     * @param id The ID of the item to delete
     * @throws IOException if file deletion fails
     */
    @Transactional
    public void deleteItem(Long id) throws IOException {
        GalleryItem item = galleryItemRepository.findById(id).orElse(null);

        if (item != null && item.getFileUrl() != null) {
            // Extract filename and build file path
            String filename = item.getFileUrl().replaceFirst("^/gallery/", "");
            Path baseDir = Paths.get(galleryStoragePath);
            Path filePath = baseDir.resolve(filename);

            // Delete file from disk if it exists
            try {
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
            } catch (IOException ex) {
                // Log the error but don't throw - file may have been manually deleted
                System.err.println("Warning: Could not delete file from disk: " + filePath);
                System.err.println("Error: " + ex.getMessage());
            }
        }

        // Delete record from database
        galleryItemRepository.deleteById(id);
    }

    /**
     * Get all gallery items (no pagination)
     */
    public List<GalleryItem> getAllItems() {
        return galleryItemRepository.findAllByOrderByIdAsc();
    }

    /**
     * Delete all gallery items (admin cleanup)
     * Use with caution!
     */
    @Transactional
    public void deleteAllItems() throws IOException {
        List<GalleryItem> allItems = getAllItems();

        for (GalleryItem item : allItems) {
            deleteItem(item.getId());
        }
    }

    /**
     * Get total number of gallery items
     */
    public long getTotalItems() {
        return galleryItemRepository.count();
    }
}
