export const regex = {
    mobile: {
        'format': 'regex',
        'pattern': '^1\\d{10}$'
    },
    email: {
        'format': 'regex',
        'pattern': '[\\w-.]+@[\\w-]+(.[\\w_-]+)+'
    },
    idCard: {
        'format': 'regex',
        'pattern': '^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$'
    },
    float2: {
        'format': 'regex',
        'pattern': '^-?(([1-9][0-9]*)|(([0]\\.\\d{1,2}|[1-9][0-9]*\\.\\d{1,2})))$'
    },
    float3: {
        'format': 'regex',
        'pattern': '^-?(([1-9][0-9]*)|(([0]\\.\\d{1,3}|[1-9][0-9]*\\.\\d{1,3})))$'
    },
    float4: {
        'format': 'regex',
        'pattern': '^-?(([1-9][0-9]*)|(([0]\\.\\d{1,4}|[1-9][0-9]*\\.\\d{1,4})))$'
    }
};

export const error = {
    mobile : {
        'pattern': '手机号格式错误'
    },
    email: {
        'pattern': '邮箱格式错误'
    },
    idCard: {
        'pattern': '身份证格式错误'
    },
    float2: {
        'pattern': '小数位数不能超过2位'
    },
    float3: {
        'pattern': '小数位数不能超过3位'
    },
    float4: {
        'pattern': '小数位数不能超过4位'
    }
};
