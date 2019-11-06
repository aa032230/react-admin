export default {
    /**
     * 将时间戳转换为日期 : 2019-08-01 10:52:53  或  2019-08-01
     * @param {int} timestamp
     * @param {string}} type
     * @use this.$util.timestampToTime(1567958400) || this.$util.timestampToTime(1567958400,'date')
     */
    timestampToTime(timestamp, type) {
        if (timestamp === 0 || timestamp === '') {
            return
        }

        //时间戳为10位 *1000
        let len = timestamp.toString().split('')
        if (len.length < 13) {
            timestamp = timestamp * 1000
        }

        var date = new Date(timestamp)
        var Y = date.getFullYear() + '-'

        var M =
            (date.getMonth() + 1 < 10
                ? '0' + (date.getMonth() + 1)
                : date.getMonth() + 1) + '-'

        var D =
            (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '

        var h =
            (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
            ':'

        var m =
            (date.getMinutes() < 10
                ? '0' + date.getMinutes()
                : date.getMinutes()) + ':'

        var s =
            date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

        if (type && type === 'date') {
            //年月日
            return Y + M + D
        } else {
            //年月日时分秒
            return Y + M + D + h + m + s
        }
    }
}
