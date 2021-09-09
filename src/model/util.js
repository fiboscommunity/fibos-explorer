
var util = {
    formatDateTime(date){
        var newdate = new Date(date);
        
        var y = newdate.getFullYear();
        var m = newdate.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = newdate.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = newdate.getHours();
        h= h < 10 ? ('0' + h) : h;
        var min = newdate.getMinutes();
        min= min < 10 ? ('0' + min) : min;
        var s = newdate.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + m + '-' + d+' ' + h+':'+min+':'+s
    },
    getNowFormatDate(){
        var date = new Date();
        let Str=date.getFullYear() + '/' +
        (date.getMonth() + 1) + '/' + 
        date.getDate() + ' ' + 
        date.getHours() + ':' + 
        date.getMinutes() + ':' + 
        date.getSeconds()
        return Str
    },

     vote2stake(vote, votetime) {
        votetime = votetime || Date.now();
        const weight = ((votetime / 1000 - 946684800) / (24 * 60 * 60 * 7)) * (1 / 52);
        return parseInt(Number(vote) / Math.pow(2, weight));
    },
  
    randomName(randomFlag, min, max){
        let str = ''
        let range = min
        const arr = ['1', '2', '3', '4', '5', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        // 随机产生
        if (randomFlag) {
          range = Math.round(Math.random() * (max - min)) + min
        }
        for (var i = 0; i < range; i++) {
          const pos = Math.round(Math.random() * (arr.length - 1))
          str += arr[pos]
        }
        return str
    },

    sortUpDate(a, b) {
        return Date.parse(b.block_time) - Date.parse(a.block_time);
    }
}



export default  util;
    
