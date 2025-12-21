package com.tembhurni.grampanchayat.repository;

import com.tembhurni.grampanchayat.model.GalleryItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GalleryItemRepository extends JpaRepository<GalleryItem, Long> {

    List<GalleryItem> findByCategoryOrderByIdAsc(String category);

    List<GalleryItem> findAllByOrderByIdAsc();

    List<GalleryItem> findByCategoryOrderByCreatedAtDesc(String category);

    // ✅ Get top 'limit' recent items
    List<GalleryItem> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
