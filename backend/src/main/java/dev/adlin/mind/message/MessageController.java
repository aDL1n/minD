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
    public ResponseEntity<List<MessageDto>> get(@RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(this.service.get(PageRequest.of(0, limit)).reversed());
    }

    @GetMapping("/message/get/previous")
    public ResponseEntity<List<MessageDto>> getPrevious(
            @RequestParam Long beforeId,
            @RequestParam(defaultValue = "20") int limit
    ) {
        final PageRequest pageable = PageRequest.of(0, limit);
        return ResponseEntity.ok(this.service.getPrevious(beforeId, pageable).reversed());
    }

    @PostMapping("/message/send")
    public ResponseEntity<Void> receive(@RequestBody MessageDto message) {
        service.receive(message);
        return ResponseEntity.ok().build();
    }
}
