// import {appStateAtom} from "../../state/tasksAtom.ts";
// import {invoke} from "@tauri-apps/api";
// import {AppStorage} from "../../../atodo/state/tasksAtoms.ts";
import { useEffect } from 'react'

// export let appStoragePersistence: AppStorage | null = null

export const useDataInit = () => {

  // const [appState, setAppState] = useAtom(appStateAtom)

  useEffect(() => {
    // invoke<string>('load', { key: 'taskStorage' }).then((result) => {
    //   let appStorage: AppStorage = parse(result) as AppStorage
    //   appStoragePersistence = appStorage
    //   console.log('Overall', appStorage.taskStorage.overall)
    //   setAppState({
    //     ...appState,
    //     appStorage: {
    //       overall: appStorage.taskStorage.overall
    //     }
    //   })
    // }).catch((err) => {
    //   console.log(err)
    // })

  }, [])

}
