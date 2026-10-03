package dev.adlin.mind.message;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService service;

    @GetMapping("/message/get")
    public ResponseEntity<List<MessageDto>> get(@RequestParam(defaultValue = "10") int limit) {
        final PageRequest pageable = PageRequest.of(0, Math.clamp(limit, 1, 100));
        return ResponseEntity.ok(this.service.get(pageable).reversed());
    }

    @GetMapping("/message/get/previous")
    public ResponseEntity<List<MessageDto>> getPrevious(
            @RequestParam Long beforeId,
            @RequestParam(defaultValue = "10") int limit
    ) {
        final PageRequest pageable = PageRequest.of(0, Math.clamp(limit, 1, 100));
        return ResponseEntity.ok(this.service.getPrevious(beforeId, pageable));
    }

    @PostMapping("/message/send")
    public ResponseEntity<Void> receive(@RequestBody MessageDto message) {
        service.receive(message);
        return ResponseEntity.ok().build();
    }
}
