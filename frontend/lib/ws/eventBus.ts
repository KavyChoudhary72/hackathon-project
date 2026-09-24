"use client";

import { useEffect } from "react";

type EventCallback = (data: any) => void;

class BrowserEventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: EventCallback) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
    }
  }

  emit(event: string, data?: any) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }
}

export const eventBus = new BrowserEventBus();

export function useLiveEvents(event: string, callback: EventCallback) {
  useEffect(() => {
    const unsubscribe = eventBus.on(event, callback);
    return () => unsubscribe();
  }, [event, callback]);
}
