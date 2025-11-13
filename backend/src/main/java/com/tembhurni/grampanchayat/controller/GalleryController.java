package com.tembhurni.grampanchayat.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tembhurni.grampanchayat.model.FileType;
import com.tembhurni.grampanchayat.model.GalleryItem;
import com.tembhurni.grampanchayat.service.GalleryService;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    @Autowired
    private GalleryService galleryService;

    @GetMapping("/category/{category}")
    public List<GalleryItem> getGalleryItemsByCategory(@PathVariable String category) {
        return galleryService.getItemsByCategory(category);
    }

    @GetMapping("/recent")
    public List<GalleryItem> getRecentGalleryItems() {
        return galleryService.getRecentItems(10);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadGalleryItem(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category,
            @RequestParam("title") String title,
            @RequestParam("year") Integer year,
            @RequestParam("month") String month,
            @RequestParam("type") String type
    ) {
        try {
            GalleryItem item = galleryService.uploadItem(
                    file, category, title, year, month, FileType.valueOf(type)
            );
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }
}
