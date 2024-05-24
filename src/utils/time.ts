//封装一个函数:获取一个结果:当前早上|上午|下午|晚上
export const getTime = () => {
  let msg = ''
    //通过内置构造函数Date
  let hours = new Date().getHours()
    //情况的判断
  if (hours <= 9) {
    msg = '早上'
  } else if (hours <= 12) {
    msg = '上午'
  } else if (hours <= 18) {
    msg = '下午'
  } else {
    msg = '晚上'
  }
  return msg
}
