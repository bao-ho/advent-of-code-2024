import re

maps = []
with open('/Users/gqm/Documents/Dev/Web/mini-scripts/advend-of-code-2024/day-6/input.txt', 'r') as f:
    lines = f.readlines()
    for l in lines:
        maps.append(l.strip())

max_row = len(maps)
max_col = len(maps[0])
step_pos = set()
obs_pos = []
pos_queue = []

def get_start_pos():
    for row in range(max_row):
        match = re.search(r'\^', maps[row])
        if match != None:
            print(f'Found at row = {row} col = {match.start()}')
            return row, match.start()
def get_next_direction(direction):
    if direction == 'up':
        return 'right'
    if direction == 'right':
        return 'down'
    if direction == 'down':
        return 'left'
    if direction == 'left':
        return 'up'
 
def get_next_obs(row, col, direction):
    if direction == 'up':
        for r in reversed(range(row+1)):
            if maps[r][col] == '#':
                return (r, col)
        return -1, -1
    if direction == 'right':
        for c in range(col, max_col):
            if maps[row][c] == '#':
                return (row, c)
        return -1, -1
    if direction == 'down':
        for r in range(row, max_row):
            if maps[r][col] == '#':
                return (r, col)
        return -1, -1
    if direction == 'left':
        for c in reversed(range(col+1)):
            if maps[row][c] == '#':
                return (row, c)
        return -1, -1
     
start_r, start_c = get_start_pos()
print(f'max_row == {max_row} max_col = {max_col}')

def find_obstack(pos, direction):
    start_r = pos[0]
    start_c = pos[1]
    step = 0
    if direction == 'up':
        for row in reversed(range(start_r+1)):
            if maps[row][start_c] == '#':
                obs_pos.append((row, start_c, direction))
                return False, row+1, start_c, 'right'
            else:
                step_pos.add((row, start_c))
                if row > 0 and maps[row-1][start_c] != '#':
                    r, c = get_next_obs(row, start_c, get_next_direction(direction))
                    if (r,c, get_next_direction(direction)) in obs_pos:
                        # print(r, c, get_next_direction(direction))
                        print(row-1,start_c)
                        pos_queue.append(1)
                if row == 0:
                    return True, row, start_c, 'right'
    if direction == 'right':
        for col in range(start_c, max_col):
            if maps[start_r][col] == '#':
                obs_pos.append((start_r, col, direction))
                return False, start_r, col-1, 'down'
            else:
                step_pos.add((start_r, col))
                if col < max_col-1 and maps[start_r][col+1] != '#':
                    r, c = get_next_obs(start_r, col, get_next_direction(direction))
                    if (r, c, get_next_direction(direction)) in obs_pos:
                        # print(r, c, get_next_direction(direction))
                        print(start_r,col+1)
                        pos_queue.append(1)
                if col == max_col-1:
                    return True, start_r, col, 'down'
    if direction == 'down':
        for row in range(start_r, max_row):
            if maps[row][start_c] == '#':
                obs_pos.append((row, start_c, direction))
                return False, row-1, start_c, 'left'
            else:
                step_pos.add((row, start_c))
                if row < max_row-1 and maps[row+1][start_c] != '#':
                    r, c = get_next_obs(row, start_c, get_next_direction(direction))
                    if (r, c, get_next_direction(direction)) in obs_pos:
                        # print(r, c, get_next_direction(direction))
                        print(row+1,start_c)
                        pos_queue.append(1)
                if row == max_row-1:
                    return True, row, start_c, 'left'
    if direction == 'left':
        for col in reversed(range(start_c+1)):
            if maps[start_r][col] == '#':
                obs_pos.append((start_r, col, direction))
                return False, start_r, col+1, 'up'
            else:
                step_pos.add((start_r, col))
                if col > 0 and maps[start_r][col-1] != '#':
                    r, c = get_next_obs(start_r, col, get_next_direction(direction)) 
                    if (r, c, get_next_direction(direction)) in obs_pos:
                        # print(r, c, get_next_direction(direction))
                        print(start_r,col-1)
                        pos_queue.append(1)
                if col == 0:
                    return True, start_r, col, 'up'
walkthrough = True
direction = 'up'
while walkthrough:
    is_done, start_r, start_c, direction = find_obstack((start_r, start_c), direction)
    # print(f'is_done = {is_done} start_r = {start_r} start_c = {start_c} direction = {direction}')
    if is_done:
        walkthrough = False
    if len(pos_queue)>10:
        walkthrough = False
print(len(step_pos))
# print(obs_pos)
print(len(pos_queue))