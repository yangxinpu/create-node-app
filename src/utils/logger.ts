import * as prompts from '@clack/prompts'
import pc from 'picocolors'

export const logger = {
  intro(title: string): void {
    prompts.intro(pc.bold(pc.cyan(title)))
  },
  info(message: string): void {
    prompts.log.info(message)
  },
  success(message: string): void {
    prompts.log.success(message)
  },
  warn(message: string): void {
    prompts.log.warn(pc.yellow(message))
  },
  error(message: string): void {
    prompts.log.error(pc.red(message))
  },
  step(message: string): void {
    prompts.log.step(message)
  },
  note(message: string, title?: string): void {
    prompts.note(message, title)
  },
  outro(message: string): void {
    prompts.outro(message)
  },
  cancel(message: string): void {
    prompts.cancel(pc.red(message))
  },
  spinner(): ReturnType<typeof prompts.spinner> {
    if (!process.stdout.isTTY) {
      return {
        start(): void {},
        stop(message = '', code = 0): void {
          if (code === 0) {
            prompts.log.success(message)
          } else {
            prompts.log.error(message)
          }
        },
        message(): void {},
      }
    }
    return prompts.spinner()
  },
}
