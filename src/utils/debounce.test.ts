import { debounce } from "./debounce"

let _TIMES = 0
function batchLog(_sss: string) {
  _TIMES++
}

const bou = debounce(batchLog, 250, { maxWait: 1000 })

for (let i = 0; i < 1000; i++) {
  setTimeout(() => {
    bou(i.toString())
  }, 1000)
}

for (let i = 1000; i < 2000; i++) {
  setTimeout(() => {
    bou(i.toString())
  }, 1000)
}
