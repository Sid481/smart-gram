package com.tembhurni.grampanchayat.repository;

import com.tembhurni.grampanchayat.model.GalleryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


public interface GalleryItemRepository extends JpaRepository<GalleryItem, Long> {
	
	List<GalleryItem> findByCategoryOrderByIdAsc(String category);
    List<GalleryItem> findAllByOrderByIdAsc();
    
}
