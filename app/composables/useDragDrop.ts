// app/composables/useDragDrop.ts

import { ref, computed, type Ref, type ComputedRef } from 'vue'

// ─── Interfaces ───────────────────────────────────────────

export interface DragState {
  cardId: number
  sourceEtapaId: number
  currentOverEtapaId: number | null
}

export interface DragDropOptions {
  onDrop: (cardId: number, targetEtapaId: number) => Promise<void>
  onError: (error: Error) => void
}

// ─── Constantes ───────────────────────────────────────────

const LONG_PRESS_DURATION = 500 // ms para considerar toque longo
const MOVE_THRESHOLD = 10 // px de movimento antes de cancelar long press

// ─── Composable ───────────────────────────────────────────

export function useDragDrop(options: DragDropOptions) {
  const dragState: Ref<DragState | null> = ref(null)
  const isDragging: ComputedRef<boolean> = computed(() => dragState.value !== null)

  // ─── Touch: Estado interno ─────────────────────────────
  let longPressTimer: ReturnType<typeof setTimeout> | null = null
  let touchGhost: HTMLElement | null = null
  let touchStartX = 0
  let touchStartY = 0
  let isTouchDragging = false

  // ─── Desktop: HTML5 Drag and Drop ──────────────────────

  /**
   * Inicia o arraste de um card (desktop).
   * Cria um elemento ghost semi-transparente como drag image.
   */
  function onDragStart(event: DragEvent, cardId: number, etapaId: number): void {
    if (!event.dataTransfer) return

    // Configura dados do drag
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(cardId))

    // Cria ghost element semi-transparente
    const ghost = createGhostElement(event.target as HTMLElement)
    document.body.appendChild(ghost)
    event.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, 20)

    // Remove o ghost após o browser capturar a imagem
    requestAnimationFrame(() => {
      document.body.removeChild(ghost)
    })

    // Atualiza estado reativo
    dragState.value = {
      cardId,
      sourceEtapaId: etapaId,
      currentOverEtapaId: null,
    }
  }

  /**
   * Marca uma coluna como alvo de drop (desktop).
   * Previne o comportamento default para permitir o drop.
   */
  function onDragOver(event: DragEvent, etapaId: number): void {
    event.preventDefault()

    if (!event.dataTransfer) return
    event.dataTransfer.dropEffect = 'move'

    // Atualiza a coluna sobre a qual o card está sendo arrastado
    if (dragState.value && dragState.value.currentOverEtapaId !== etapaId) {
      dragState.value.currentOverEtapaId = etapaId
    }
  }

  /**
   * Remove destaque da coluna quando o drag sai (desktop).
   */
  function onDragLeave(event: DragEvent, etapaId: number): void {
    // Só limpa se estiver saindo da coluna atual
    if (dragState.value && dragState.value.currentOverEtapaId === etapaId) {
      dragState.value.currentOverEtapaId = null
    }
  }

  /**
   * Finaliza o arraste: move o card para a nova coluna (desktop).
   */
  async function onDrop(event: DragEvent, etapaId: number): Promise<void> {
    event.preventDefault()

    if (!dragState.value) return

    const { cardId, sourceEtapaId } = dragState.value

    // Se soltou na mesma coluna, apenas cancela
    if (etapaId === sourceEtapaId) {
      cancelDrag()
      return
    }

    // Limpa estado de drag antes de chamar callback
    const currentState = { ...dragState.value }
    cancelDrag()

    // Chama callback de drop (movimentação + persistência)
    try {
      await options.onDrop(currentState.cardId, etapaId)
    } catch (err: any) {
      options.onError(
        err instanceof Error ? err : new Error(err?.message ?? 'Erro ao mover card')
      )
    }
  }

  /**
   * Chamado quando o drag termina (seja por drop ou cancelamento).
   * Limpa estado global.
   */
  function onDragEnd(event: DragEvent): void {
    cancelDrag()
  }

  /**
   * Limpa o estado de drag/drop (desktop e touch).
   * Remove ghost element, timers e restaura scroll.
   */
  function cancelDrag(): void {
    dragState.value = null

    // Limpa timer de long press se pendente
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }

    // Remove ghost element do touch
    if (touchGhost) {
      touchGhost.remove()
      touchGhost = null
    }

    // Restaura scroll da página
    if (isTouchDragging) {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      isTouchDragging = false
    }
  }

  // ─── Touch: Mobile Drag and Drop ──────────────────────

  /**
   * Inicia detecção de toque longo em um card (mobile).
   * Após 500ms sem movimento significativo, ativa o modo de arraste.
   */
  function onTouchStart(event: TouchEvent, cardId: number, etapaId: number): void {
    const touch = event.touches[0]
    touchStartX = touch.clientX
    touchStartY = touch.clientY

    // Inicia timer de long press
    longPressTimer = setTimeout(() => {
      // Feedback tátil (vibração) se disponível
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }

      // Ativa estado de drag
      dragState.value = {
        cardId,
        sourceEtapaId: etapaId,
        currentOverEtapaId: null,
      }

      isTouchDragging = true

      // Bloqueia scroll da página durante arraste
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'

      // Cria ghost element seguindo o dedo
      const sourceElement = event.target as HTMLElement
      const cardElement = sourceElement.closest('[data-card-id]') as HTMLElement || sourceElement
      touchGhost = createGhostElement(cardElement)
      touchGhost.style.position = 'fixed'
      touchGhost.style.top = `${touchStartY - 20}px`
      touchGhost.style.left = `${touchStartX - (cardElement.offsetWidth / 2)}px`
      touchGhost.style.width = `${cardElement.offsetWidth}px`
      document.body.appendChild(touchGhost)
    }, LONG_PRESS_DURATION)
  }

  /**
   * Move o ghost element com o dedo (mobile).
   * Detecta qual coluna está sob o dedo via elementFromPoint.
   * Se o dedo se mover antes do long press, cancela o timer (é um scroll).
   */
  function onTouchMove(event: TouchEvent): void {
    const touch = event.touches[0]

    // Se ainda não está arrastando, verifica se o dedo se moveu demais (cancela long press)
    if (!isTouchDragging) {
      const dx = Math.abs(touch.clientX - touchStartX)
      const dy = Math.abs(touch.clientY - touchStartY)

      if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
        // Movimento significativo antes do long press = scroll normal, cancela
        if (longPressTimer) {
          clearTimeout(longPressTimer)
          longPressTimer = null
        }
      }
      return
    }

    // Previne scroll durante arraste ativo
    event.preventDefault()

    // Move ghost element
    if (touchGhost) {
      touchGhost.style.top = `${touch.clientY - 20}px`
      touchGhost.style.left = `${touch.clientX - (touchGhost.offsetWidth / 2)}px`
    }

    // Detecta coluna de destino sob o dedo
    // Oculta ghost temporariamente para que elementFromPoint encontre a coluna
    if (touchGhost) {
      touchGhost.style.pointerEvents = 'none'
    }

    const elementUnderFinger = document.elementFromPoint(touch.clientX, touch.clientY)

    if (touchGhost) {
      touchGhost.style.pointerEvents = 'none'
    }

    if (elementUnderFinger && dragState.value) {
      // Procura o elemento da coluna mais próximo (com data-etapa-id)
      const columnElement = elementUnderFinger.closest('[data-etapa-id]') as HTMLElement | null

      if (columnElement) {
        const etapaId = Number(columnElement.dataset.etapaId)
        if (!isNaN(etapaId) && dragState.value.currentOverEtapaId !== etapaId) {
          dragState.value.currentOverEtapaId = etapaId
        }
      } else {
        dragState.value.currentOverEtapaId = null
      }
    }
  }

  /**
   * Finaliza o arraste por toque (mobile).
   * Detecta coluna de destino e chama callback de drop.
   */
  async function onTouchEnd(event: TouchEvent): Promise<void> {
    // Se não estava arrastando, apenas limpa timer
    if (!isTouchDragging) {
      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }
      return
    }

    if (!dragState.value) {
      cancelDrag()
      return
    }

    const { cardId, sourceEtapaId, currentOverEtapaId } = dragState.value

    // Limpa estado visual antes de processar
    const targetEtapaId = currentOverEtapaId
    cancelDrag()

    // Se não soltou em nenhuma coluna ou soltou na mesma, cancela
    if (!targetEtapaId || targetEtapaId === sourceEtapaId) {
      return
    }

    // Chama callback de drop (movimentação + persistência)
    try {
      await options.onDrop(cardId, targetEtapaId)
    } catch (err: any) {
      options.onError(
        err instanceof Error ? err : new Error(err?.message ?? 'Erro ao mover card')
      )
    }
  }

  // ─── Ghost Element ─────────────────────────────────────

  /**
   * Cria um clone visual semi-transparente do card arrastado
   * para usar como drag image nativa.
   */
  function createGhostElement(sourceElement: HTMLElement): HTMLElement {
    const ghost = sourceElement.cloneNode(true) as HTMLElement

    // Estiliza o ghost para ser semi-transparente
    ghost.style.position = 'absolute'
    ghost.style.top = '-9999px'
    ghost.style.left = '-9999px'
    ghost.style.width = `${sourceElement.offsetWidth}px`
    ghost.style.opacity = '0.7'
    ghost.style.transform = 'rotate(2deg)'
    ghost.style.pointerEvents = 'none'
    ghost.style.zIndex = '9999'
    ghost.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
    ghost.style.borderRadius = '8px'

    return ghost
  }

  // ─── Helpers para binding no template ──────────────────

  /**
   * Verifica se uma etapa específica está sendo "hovered" durante drag.
   */
  function isOverEtapa(etapaId: number): ComputedRef<boolean> {
    return computed(() => dragState.value?.currentOverEtapaId === etapaId)
  }

  return {
    dragState,
    isDragging,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    cancelDrag,
    isOverEtapa,
  }
}
