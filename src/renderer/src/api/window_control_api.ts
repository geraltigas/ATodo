export class window_control_api {
  public static set_frameless(): void {
    // @ts-ignore
    window.win.set_frameless()
  }

  public static set_fullscreen(): void {
    // @ts-ignore
    window.win.fullscreen(true)
  }

  public static set_miminize(): void {
    // @ts-ignore
    window.win.miminize(true)
  }

  public static set_maximize(): void {
    // @ts-ignore
    window.win.maximize(true)
  }

  public static set_close(): void {
    // @ts-ignore
    window.win.close(true)
  }

  public static exit_maximize(): void {
    // @ts-ignore
    window.win.unmaximize(true)
  }
}
