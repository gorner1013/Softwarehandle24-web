export function useClickOutside(el_target_ref: any, callback_fn: any) {
  if (!el_target_ref)
return

  const listener = (e: any) => {
    if (
      e.target === el_target_ref.value ||
      e.composedPath().includes(el_target_ref.value)
    ) {
      return
    }
    if (typeof callback_fn === 'function') {
      callback_fn()
    }
  }

  onMounted(() => {
    window.addEventListener('click', listener)
  })
  onBeforeMount(() => {
    window.removeEventListener('click', listener)
  })
  return {
    listener,
  }
}
