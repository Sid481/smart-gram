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

    // Base directory on Render Disk, e.g. /data/gallery
    @Value("${gallery.storage.path:/data/gallery}")
    private String galleryStoragePath;

    /**
     * Upload a new gallery item and store file on disk + metadata in the database.
     */
    @Transactional
    public GalleryItem uploadItem(
            MultipartFile file,
            String category,
            String title,
            Integer year,
            String month,
            FileType type
    ) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // 1. Ensure directory exists
        Path baseDir = Paths.get(galleryStoragePath);
        Files.createDirectories(baseDir);

        // 2. Build a unique filename
        String originalName = file.getOriginalFilename();
        String ext = "";
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf('.'));
        }
        String uniqueName = UUID.randomUUID() + ext;
        Path target = baseDir.resolve(uniqueName);

        // 3. Save file bytes to disk
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // 4. Persist metadata + logical URL (relative path)
        GalleryItem item = new GalleryItem();
        item.setTitle(title);
        item.setCategory(category);
        item.setYear(year);
        item.setMonth(month);
        item.setUploadTimestamp(LocalDateTime.now());
        item.setType(type);
        item.setContentType(file.getContentType());

        // Store relative path; controller will resolve it under storage path
        String relativePath = "/gallery/" + uniqueName;
        item.setFileUrl(relativePath);

        // Do NOT store fileData for disk-based storage
        item.setFileData(null);

        return galleryItemRepository.save(item);
    }

    /**
     * Returns all items of a category ordered by id ascending.
     */
    public List<GalleryItem> getItemsByCategory(String category) {
        return galleryItemRepository.findByCategoryOrderByIdAsc(category);
    }

    /**
     * Returns at most 'count' most recent items based on id ascending.
     */
    public List<GalleryItem> getRecentItems(int count) {
        List<GalleryItem> allItemsAsc = galleryItemRepository.findAllByOrderByIdAsc();
        if (allItemsAsc.size() <= count) {
            return allItemsAsc;
        }
        return allItemsAsc.subList(allItemsAsc.size() - count, allItemsAsc.size());
    }

    /**
     * Used by controller to fetch a single item (for /{id}/file).
     */
    public GalleryItem getItemById(Long id) {
        return galleryItemRepository.findById(id).orElse(null);
    }

    /**
     * Load raw bytes from disk for a given item.
     */
    public byte[] loadFileBytes(GalleryItem item) throws IOException {
        if (item == null || item.getFileUrl() == null) {
            return null;
        }
        // fileUrl starts with /gallery/...
        Path baseDir = Paths.get(galleryStoragePath);
        Path filePath = baseDir.resolve(item.getFileUrl().replaceFirst("^/gallery/", ""));
        if (!Files.exists(filePath)) {
            return null;
        }
        return Files.readAllBytes(filePath);
    }
}
