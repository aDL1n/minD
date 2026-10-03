package dev.adlin.mind.dto;

import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;

public record ChatMessageDto(@Nullable Long id, @NonNull String message, @Nullable Long timestamp) {
}
