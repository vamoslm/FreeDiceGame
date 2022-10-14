# coding=utf8
from flask import Flask, request
from flask import json
import operator
app = Flask(__name__)

player_counts = 0
player_mark = 0
position = ""
size = 0

@app.route('/')
def hello_world():
    return "Hello"

@app.route('/match',methods=['POST'])
def match():
    if request.method == 'POST':
        print("一位玩家成功进入在线匹配")
        global player_counts
        player_counts = player_counts+1
        if player_counts == 2:
            string = "人数已达2人，成功匹配"
            print(string)
            return json.dumps(string.encode('utf8').decode('utf8'))
        else:
            string = f"人数已达{player_counts}人，继续等待"
            print(string)
            return json.dumps(string.encode('utf8').decode('utf8'))
    else:
        string = '一位玩家进入在线匹配失败'
        print(string)
        return json.dumps(string.encode('utf8').decode('utf8'))

@app.route('/match_counts',methods=['POST'])
def match_counts():
    global player_counts
    if request.method == 'POST':
        if player_counts == 2:
            string = "人数已达2人，成功匹配"
            print(string)
            return json.dumps(player_counts)
        else:
            string = f"人数已达{player_counts}人，继续等待"
            print(string)
            return json.dumps(player_counts)
    else:
        string = '一位玩家进入在线匹配失败'
        print(string)
        return json.dumps(player_counts)

@app.route('/data_send',methods=['POST'])
def data_send():
    global position, size, player_mark
    position = str(json.loads(request.values.get("position")))
    if operator.contains(position, "player1"):
        player_mark = 1
    elif operator.contains(position, "player2"):
        player_mark = 2
    print("接收到了玩家" + str(player_mark) + "的数据")
    size = int(json.loads(request.values.get("size")))
    print("位置为：" + position)
    print("点数为：" + str(size))
    string = "成功发送数据到服务端"

    return json.dumps(string.encode('utf8').decode('utf8'))

@app.route('/data_get_player1',methods=['POST'])
def data_get_player1():
    global position, size, player_mark
    if player_mark == 2:
        key_value = {"position": position, "size": size}
        player_mark = 0
        return key_value
    else:
        key_value = {"position": "等待数据", "size": 0}
        return key_value

@app.route('/data_get_player2',methods=['POST'])
def data_get_player2():
    global position, size, player_mark
    if player_mark == 1:
        key_value = {"position": position, "size": size}
        player_mark = 0
        return key_value
    else:
        key_value = {"position": "等待数据", "size": 0}
        return key_value

@app.route('/game_over',methods=['POST'])
def game_over():
    global position, size, player_mark, player_counts
    player_mark = 0
    player_counts = 0
    position = ""
    size = 0
    string = "游戏参数已重置"
    print(string)
    return json.dumps(string.encode('utf8').decode('utf8'))

if __name__ == '__main__':
    app.run(host='10.133.52.191', port=5000)