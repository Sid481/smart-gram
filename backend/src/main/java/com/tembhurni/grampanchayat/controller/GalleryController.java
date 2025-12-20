package com.tembhurni.grampanchayat.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.tembhurni.grampanchayat.model.FileType;
import com.tembhurni.grampanchayat.model.GalleryItem;
import com.tembhurni.grampanchayat.service.GalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/gallery")
// ❌ REMOVED: @CrossOrigin(origins = "*", allowedHeaders = "*")
// ✅ Using global CORS config from CorsConfig.java instead
public class GalleryController {

    @Autowired
    private GalleryService galleryService;

    /**
     * Get gallery items by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<GalleryItem>> getGalleryItemsByCategory(@PathVariable String category) {
        try {
            System.out.println("📥 GET /category/" + category);
            List<GalleryItem> items = galleryService.getItemsByCategory(category);
            System.out.println("✅ Retrieved " + items.size() + " items for category: " + category);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            System.err.println("❌ Error getting category items: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get recent gallery items with optional limit
     */
    @GetMapping("/recent")
    public ResponseEntity<List<GalleryItem>> getRecentGalleryItems(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            System.out.println("📥 GET /recent (limit: " + limit + ")");
            List<GalleryItem> items = galleryService.getRecentItems(limit);
            System.out.println("✅ Retrieved " + items.size() + " recent items");
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            System.err.println("❌ Error getting recent items: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Upload a new gallery item with file stored on disk
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadGalleryItem(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category,
            @RequestParam("title") String title,
            @RequestParam("year") Integer year,
            @RequestParam("month") String month,
            @RequestParam("type") String type) {

        System.out.println("=== 📥 UPLOAD REQUEST RECEIVED ===");
        System.out.println("File: " + file.getOriginalFilename() + " (" + file.getSize() + " bytes)");
        System.out.println("Category: " + category);
        System.out.println("Title: " + title);
        System.out.println("Year: " + year);
        System.out.println("Month: " + month);
        System.out.println("Type: " + type);

        try {
            // Validate inputs
            if (file == null || file.isEmpty()) {
                System.out.println("❌ Validation failed: File is empty");
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File is empty"));
            }

            if (category == null || category.trim().isEmpty()) {
                System.out.println("❌ Validation failed: Category is required");
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Category is required"));
            }

            if (title == null || title.trim().isEmpty()) {
                System.out.println("❌ Validation failed: Title is required");
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Title is required"));
            }

            if (year == null || year <= 0) {
                System.out.println("❌ Validation failed: Valid year is required");
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Valid year is required"));
            }

            if (month == null || month.trim().isEmpty()) {
                System.out.println("❌ Validation failed: Month is required");
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Month is required"));
            }

            // Parse and validate FileType
            FileType fileType;
            try {
                fileType = FileType.valueOf(type.toUpperCase());
                System.out.println("✅ FileType validated: " + fileType);
            } catch (IllegalArgumentException e) {
                System.out.println("❌ Validation failed: Invalid file type");
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid file type. Must be IMAGE, VIDEO, or PDF"));
            }

            // Upload the item
            System.out.println("📤 Uploading item to service...");
            GalleryItem item = galleryService.uploadItem(
                    file, category, title, year, month, fileType
            );
            System.out.println("✅ Item uploaded successfully: " + item.getId());

            return ResponseEntity.status(201).body(item);

        } catch (IOException e) {
            System.err.println("❌ IO Error during upload: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to save file: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Unexpected error during upload: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    /**
     * Get a single gallery item by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<GalleryItem> getGalleryItem(@PathVariable Long id) {
        try {
            System.out.println("📥 GET /gallery/" + id);
            GalleryItem item = galleryService.getItemById(id);
            if (item == null) {
                System.out.println("❌ Item not found: " + id);
                return ResponseEntity.notFound().build();
            }
            System.out.println("✅ Retrieved item: " + id);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            System.err.println("❌ Error getting item: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Download/Stream gallery file (image, video, or PDF)
     */
    @GetMapping("/{id}/file")
    public ResponseEntity<byte[]> getGalleryFile(@PathVariable Long id) {
        try {
            System.out.println("📥 GET /gallery/" + id + "/file");
            GalleryItem item = galleryService.getItemById(id);
            if (item == null) {
                System.out.println("❌ Item not found: " + id);
                return ResponseEntity.notFound().build();
            }

            // Load file bytes from disk
            byte[] data = galleryService.loadFileBytes(item);
            if (data == null || data.length == 0) {
                System.out.println("❌ File bytes not found for item: " + id);
                return ResponseEntity.notFound().build();
            }

            // Determine content type
            String contentType = item.getContentType();
            if (contentType == null || contentType.isBlank()) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            System.out.println("✅ Streaming file for item " + id + " (" + data.length + " bytes, type: " + contentType + ")");

            // Set response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentLength(data.length);

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .body(data);

        } catch (IOException ex) {
            System.err.println("❌ IO Error loading file: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            System.err.println("❌ Unexpected error loading file: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Delete a gallery item (removes both DB record and disk file)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGalleryItem(@PathVariable Long id) {
        try {
            System.out.println("📥 DELETE /gallery/" + id);
            GalleryItem item = galleryService.getItemById(id);
            if (item == null) {
                System.out.println("❌ Item not found: " + id);
                return ResponseEntity.notFound().build();
            }

            galleryService.deleteItem(id);
            System.out.println("✅ Item deleted successfully: " + id);

            return ResponseEntity.ok()
                    .body(Map.of("message", "Item deleted successfully", "id", id));

        } catch (IOException e) {
            System.err.println("❌ IO Error during delete: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to delete file: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Unexpected error during delete: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Delete failed: " + e.getMessage()));
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "Gallery API is running"));
    }
}
