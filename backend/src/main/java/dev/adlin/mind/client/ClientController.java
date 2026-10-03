package dev.adlin.mind.client;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService service;

    @GetMapping("/online")
    public ResponseEntity<Integer> getOnlineCount() {
        return ResponseEntity.ok(service.getOnlineCount());
    }

    @GetMapping(value = "/subscribe")
    public SseEmitter subscribe() {
        return service.subscribe();
    }
}
