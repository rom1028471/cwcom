package com.roomih.orderapi.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.roomih.orderapi.model.Publication;
import com.roomih.orderapi.service.PublicationService;

@RestController
@RequestMapping("/api/publications")
@RequiredArgsConstructor
public class PublicationController {

    private final PublicationService publicationService;

    @GetMapping
    @Operation(summary = "Получить список публикаций")
    public ResponseEntity<Page<Publication>> getPublications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String searchQuery) {
        return ResponseEntity.ok(publicationService.findPublications(searchQuery, PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить публикацию по ID")
    public ResponseEntity<Publication> getPublication(@PathVariable Long id) {
        return ResponseEntity.ok(publicationService.getPublicationById(id));
    }

    @PostMapping
    @Operation(summary = "Создать новую публикацию")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Publication> createPublication(@RequestBody Publication publication) {
        return ResponseEntity.ok(publicationService.createPublication(publication));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить публикацию")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Publication> updatePublication(
            @PathVariable Long id,
            @RequestBody Publication publication) {
        return ResponseEntity.ok(publicationService.updatePublication(id, publication));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить публикацию")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deletePublication(@PathVariable Long id) {
        publicationService.deletePublication(id);
        return ResponseEntity.ok().build();
    }
}
