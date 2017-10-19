
import { test } from 'pietr'
import { assert } from 'chai'

import { Graph, shortestPath } from '../src/dijkstra'

/*
          20
    A -------- D
   2 \        / 4
      B ---- C
          3
*/

const ABCD: Graph = {
    A: { B:  2, D: 20 },
    B: { A:  2, C:  3 },
    C: { B:  3, D:  4 },
    D: { A: 20, C:  4 }
};


/*
    A ----- 30 ----- F
     \              /|\
      \            9 | \
       \          /  |  \
       10        C  12   \
         \      / \  |    |
          \    7   1 |    |
           \  /     \|    |
            B -- 5 - D    |
             \            |
              2           |
               \          |
                E -- 19 --
*/

const ABCDEF: Graph = {
    A: { B: 10, F: 30 },
    B: { A: 10, C:  7, D:  5, E:  2 },
    C: { B:  7, D:  1, F:  9 },
    D: { B:  5, C:  1, F: 12 },
    E: { B:  2, F: 19 },
    F: { A: 30, C:  9, D: 12, E: 19 },
};


/*
    A ------ 27 -----> C
    |                  ^
   10                  |
    |                  |
    V                  |
    B ------ 15 -------'
*/

const OneWay: Graph = {
    A: { B: 10, C: 27 },
    B: { C: 15 }
};

/*
    A -- 0 -- B
    |         |
    5         |
    |         |
    C -- 3 ---'
*/

const Cyclic: Graph = {
    A: { B: 0, C: 5 },
    B: { A: 0, C: 3 },
    C: { A: 5, B: 3 }
};

test('Empty graph', () => {
    assert.isUndefined(shortestPath({}, 'A', 'B'));
});

test('Inexistent start', () => {
    assert.isUndefined(shortestPath(ABCD, 'A', 'E'));
});

test('Inexistent end', () => {
    assert.isUndefined(shortestPath(ABCD, 'F', 'A'));
});

test('Inexistent route', () => {
    assert.deepEqual(shortestPath(OneWay, 'A', 'C'), [ 'A,B,C'.split(','), 25]);

    assert.isUndefined(shortestPath(OneWay, 'B', 'A'));
    assert.isUndefined(shortestPath(OneWay, 'C', 'A'));
    assert.isUndefined(shortestPath(OneWay, 'C', 'B'));
});

test('Cyclic', () => {
    assert.deepEqual(shortestPath(Cyclic, 'A', 'C'), [ 'A,B,C'.split(','), 3 ]);
    assert.deepEqual(shortestPath(Cyclic, 'A', 'B'), [ 'A,B'.split(','), 0 ]);
    assert.deepEqual(shortestPath(Cyclic, 'A', 'A'), [ 'A'.split(','), 0 ]);
    assert.deepEqual(shortestPath(Cyclic, 'C', 'B'), [ 'C,B'.split(','), 3 ]);
});

test('Graph - ABCD', () => {
    assert.deepEqual(shortestPath(ABCD, 'A', 'D'), [ 'A,B,C,D'.split(','), 9 ]);
    assert.deepEqual(shortestPath(ABCD, 'B', 'D'), [ 'B,C,D'.split(','), 7 ]);
})

test('Graph - ABCDEF', () => {
    assert.deepEqual(shortestPath(ABCDEF, 'A', 'F'), [ 'A,B,D,C,F'.split(','), 25 ]);
});
