import type { JSX } from 'solid-js'
import type { ExternalToast, FixMe, PromiseData, PromiseT, ToastT, ToastToDismiss, ToastTypes } from './types'

let toastsCounter = 0

class Observer {
  subscribers: Array<(toast: ExternalToast | ToastToDismiss) => void>
  toasts: Array<ToastT | ToastToDismiss>

  constructor() {
    this.subscribers = []
    this.toasts = []
  }

  // We use arrow functions to maintain the correct `this` reference
  subscribe = (subscriber: (toast: ToastT | ToastToDismiss) => void) => {
    this.subscribers.push(subscriber as FixMe)

    return () => {
      const index = this.subscribers.indexOf(subscriber as FixMe)
      this.subscribers.splice(index, 1)
    }
  }

  publish = (data: ToastT) => {
    this.subscribers.forEach(subscriber => subscriber(data))
  }

  addToast = (data: ToastT) => {
    this.publish(data)
    this.toasts = [...this.toasts, data]
  }

  create = (data: ExternalToast & { message?: string | JSX.Element; type?: ToastTypes; promise?: PromiseT }) => {
    const { message, ...rest } = data
    const id = typeof data?.id === 'number' || (data.id && data.id?.length > 0) ? data.id : toastsCounter++

    const alreadyExists = this.toasts.find((toast) => {
      return toast.id === id
    })

    if (alreadyExists) {
      this.toasts = this.toasts.map((toast) => {
        if (toast.id === id) {
          this.publish({ ...toast, ...data, id, title: message })
          return { ...toast, ...data, id, title: message }
        }

        return toast
      })
    }
    else {
      this.addToast({ title: message, ...rest, id: id! })
    }

    return id
  }

  dismiss = (id?: number | string) => {
    if (!id) {
      this.toasts.forEach((toast) => {
        this.subscribers.forEach(subscriber => subscriber({ id: toast.id, dismiss: true }))
      })
    }

    this.subscribers.forEach(subscriber => subscriber({ id, dismiss: true }))
    return id
  }

  message = (message: string | JSX.Element, data?: ExternalToast) => {
    return this.create({ ...data, message })
  }

  error = (message: string | JSX.Element, data?: ExternalToast) => {
    return this.create({ ...data, message, type: 'error' })
  }

  success = (message: string | JSX.Element, data?: ExternalToast) => {
    return this.create({ ...data, type: 'success', message })
  }

  info = (message: string | JSX.Element, data?: ExternalToast) => {
    return this.create({ ...data, type: 'info', message })
  }

  warning = (message: string | JSX.Element, data?: ExternalToast) => {
    return this.create({ ...data, type: 'warning', message })
  }

  promise = <ToastData>(promise: PromiseT<ToastData>, data?: PromiseData<ToastData>) => {
    if (!data) {
      // Nothing to show
      return
    }

    let id: string | number | undefined
    if (data.loading !== undefined) {
      id = this.create({
        ...data,
        promise,
        type: 'loading',
        message: data.loading,
      })
    }

    const p = promise instanceof Promise ? promise : promise()

    let shouldDismiss = id !== undefined

    p.then((response) => {
      // TODO: Clean up TS here, response has incorrect type
      // @ts-expect-error: Incorrect response type
      if (response && typeof response.ok === 'boolean' && !response.ok) {
        shouldDismiss = false
        const message
          // @ts-expect-error: Incorrect response type
          = typeof data.error === 'function' ? data.error(`HTTP error! status: ${response.status}`) : data.error
        this.create({ id, type: 'error', message })
      }
      else if (data.success !== undefined) {
        shouldDismiss = false
        const message = typeof data.success === 'function' ? data.success(response) : data.success
        this.create({ id, type: 'success', message })
      }
    })
      .catch((error) => {
        if (data.error !== undefined) {
          shouldDismiss = false
          const message = typeof data.error === 'function' ? data.error(error) : data.error
          this.create({ id, type: 'error', message })
        }
      })
      .finally(() => {
        if (shouldDismiss) {
          // Toast is still in load state (and will be indefinitely — dismiss it)
          this.dismiss(id)
          id = undefined
        }

        data.finally?.()
      })

    return id
  }

  loading = (message: string | JSX.Element, data?: ExternalToast) => {
    return this.create({ ...data, type: 'loading', message })
  }

  // We can't provide the toast we just created as a prop as we didn't create it yet, so we can create a default toast object, I just don't know how to use function in argument when calling()?
  custom = (jsx: (id: number | string) => JSX.Element, data?: ExternalToast) => {
    const id = data?.id || toastsCounter++
    this.publish({ jsx: jsx(id), id, ...data })
    return id
  }
}

export const ToastState = new Observer()

// bind this to the toast function
function toastFunction(message: string | JSX.Element, data?: ExternalToast) {
  const id = data?.id || toastsCounter++

  ToastState.addToast({
    title: message,
    ...data,
    id,
  })
  return id
}

const basicToast = toastFunction

// We use `Object.assign` to maintain the correct types as we would lose them otherwise
export const toast = Object.assign(basicToast, {
  success: ToastState.success,
  info: ToastState.info,
  warning: ToastState.warning,
  error: ToastState.error,
  custom: ToastState.custom,
  message: ToastState.message,
  promise: ToastState.promise,
  dismiss: ToastState.dismiss,
  loading: ToastState.loading,
})
