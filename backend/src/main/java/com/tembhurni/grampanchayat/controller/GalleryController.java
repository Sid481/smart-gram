package com.tembhurni.grampanchayat.controller;

import com.tembhurni.grampanchayat.model.FileType;
import com.tembhurni.grampanchayat.model.GalleryItem;
import com.tembhurni.grampanchayat.service.GalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    @Autowired
    private GalleryService galleryService;

    // Admin-only upload endpoint
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadGalleryItem(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category,
            @RequestParam("title") String title,
            @RequestParam("year") Integer year,
            @RequestParam("month") String month,
            @RequestParam("type") String type, // IMAGE, VIDEO, PDF
            Principal principal
    ) {
        try {
            GalleryItem item = galleryService.uploadItem(
                    file, category, title, year, month, principal.getName(), FileType.valueOf(type)
            );
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    // View category-wise gallery items
    @GetMapping("/category/{category}")
    public List<GalleryItem> getGalleryItemsByCategory(@PathVariable String category) {
        return galleryService.getItemsByCategory(category);
    }

    // View recent gallery items
    @GetMapping("/recent")
    public List<GalleryItem> getRecentGalleryItems() {
        return galleryService.getRecentItems(10);
    }
}
