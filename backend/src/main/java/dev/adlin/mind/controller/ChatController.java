package dev.adlin.mind.controller;

import dev.adlin.mind.dto.ChatMessageDto;
import dev.adlin.mind.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/message/get")
    public ResponseEntity<List<ChatMessageDto>> getMessages(@RequestParam Pageable pageable) {
        return ResponseEntity.ok(this.chatService.getMessages(pageable));
    }

    @GetMapping("/message/get/prev")
    public ResponseEntity<List<ChatMessageDto>> getPrevMessages(@RequestParam Long beforeId, @RequestParam Pageable pageable) {
        return ResponseEntity.ok(this.chatService.getPreviousMessages(beforeId, pageable));
    }

    @PostMapping("/message/send")
    public ResponseEntity<ChatMessageDto> receiveMessage(@RequestBody ChatMessageDto message) {
        return this.chatService.receiveMessage(message)
                .map(ResponseEntity::ok)
                .orElse(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }

    @PostMapping("/message/subscribe")
    public SseEmitter subscribeToUpdateMessages() {
        return chatService.registerEmitter();
    }

    @GetMapping("/")
    public ResponseEntity<Integer> getOnlineCount() {
        return ResponseEntity.ok(this.chatService.getOnlineCount());
    }
}
