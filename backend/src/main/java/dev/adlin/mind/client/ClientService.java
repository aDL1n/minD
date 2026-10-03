package dev.adlin.mind.client;

import dev.adlin.mind.message.MessageDto;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ClientService {

    private final Set<SseEmitter> clients = ConcurrentHashMap.newKeySet();

    public @NonNull SseEmitter subscribe() {
        final SseEmitter client = new SseEmitter(60000L);

        client.onCompletion(() -> clients.remove(client));
        client.onTimeout(() -> clients.remove(client));
        client.onError(_ -> clients.remove(client));

        clients.add(client);

        return client;
    }

    public int getOnlineCount() {
        return clients.size();
    }

    public void broadcast(final @NonNull MessageDto message) {
        clients.forEach(emitter -> tryReceive(emitter, message));
    }

    private void tryReceive(final @NonNull SseEmitter client, final @NonNull MessageDto message) {
        try {
            client.send(message);
        } catch (IOException | IllegalStateException exception) {
            clients.remove(client);
        }
    }
}
