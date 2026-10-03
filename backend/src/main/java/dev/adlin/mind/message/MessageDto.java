package dev.adlin.mind.message;

import org.jspecify.annotations.NonNull;

public record MessageDto(
        @NonNull Long id,
        @NonNull String payload,
        @NonNull Long timestamp
) {
}
