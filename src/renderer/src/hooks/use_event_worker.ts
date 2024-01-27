// import {isMouseEnterAtom} from "../state/tasksAtom.ts";
// import { useAtom } from 'jotai'
// import React, { useCallback, useEffect } from 'react'
// import { useAtomValue } from 'jotai/index'
// import {invoke} from "@tauri-apps/api";

import { useCallback, useEffect } from 'preact/compat'
import { useNavigate } from 'react-router-dom'
import { mouse_enter } from '../state/worker'
import { window_control_api } from '../api/window_control_api'

type KeyBoardCallBack = (event: KeyboardEvent) => void;
const documentKeyBoardEventsReference: Set<KeyBoardCallBack> = new Set()

type MouseCallBack = (event: MouseEvent) => void;
const documentMouseEventsReference: Set<MouseCallBack> = new Set()

export const use_event_worker = () => {
  useOnEnterDown()
}

export const useOnMouseEnter = () => {
  return useCallback((_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    mouse_enter.value = true
  }, [])
}

export const useOnMouseLeave = () => {
  return useCallback((_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    mouse_enter.value = false
  }, [])
}

const useOnEnterDown = (): void => {
  const navigate = useNavigate()

  const callback = useCallback((event: KeyboardEvent): void => {
    if (event.key === 'Enter' && mouse_enter.value) {
      window_control_api.back_to_atodo(unregister_all_event_listener, navigate)
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

const unregister_all_event_listener = () => {
  documentKeyBoardEventsReference.forEach((callback) => {
    document.removeEventListener('keydown', callback)
  })
  documentMouseEventsReference.forEach((callback) => {
    document.removeEventListener('mousedown', callback)
  })
}


