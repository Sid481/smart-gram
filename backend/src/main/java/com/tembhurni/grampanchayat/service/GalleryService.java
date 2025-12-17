package com.tembhurni.grampanchayat.service;

import com.tembhurni.grampanchayat.model.FileType;
import com.tembhurni.grampanchayat.model.GalleryItem;
import com.tembhurni.grampanchayat.repository.GalleryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class GalleryService {

    @Autowired
    private GalleryItemRepository galleryItemRepository;

    /**
     * Upload a new gallery item and store file bytes + metadata in the database.
     */
    public GalleryItem uploadItem(
            MultipartFile file,
            String category,
            String title,
            Integer year,
            String month,
            FileType type
    ) throws IOException {

        GalleryItem item = new GalleryItem();
        item.setTitle(title);
        item.setCategory(category);
        item.setYear(year);
        item.setMonth(month);
        // Optional logical URL or can be left null when using DB storage
        item.setFileUrl(null);
        item.setUploadTimestamp(LocalDateTime.now());
        item.setType(type);

        // Store binary data + content type directly in DB
        item.setFileData(file.getBytes());
        item.setContentType(file.getContentType());

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
     * No filesystem check is needed now because data lives in the DB.
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
}
