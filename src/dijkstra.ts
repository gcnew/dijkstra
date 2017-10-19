
import { naturalOrdComparator } from './ordering'
import { mkHeap, push, pop, isEmpty } from './bin_heap_array'
export { Graph, shortestPath }

type Map<T> = { [key: string]: T | undefined }

type Graph = Map<{ [neighbour: string]: number }>


function shortestPath(graph: Graph, start: string, end: string): [ string[], number ] | undefined {
    const costsHeap = mkHeap(
        { edge: start, cost: 0 },
        (x, y) => naturalOrdComparator(x.cost, y.cost)
    );

    const edgeMap = mkMap<{ cost: number, prev?: string }>();
    edgeMap[start] = { cost: 0, prev: undefined };

    while (!isEmpty(costsHeap)) {
        const { edge, cost } = pop(costsHeap)!;

        if (edge === end) {
            break;
        }

        const neighbours = graph[edge];
        if (!neighbours) {
            continue;
        }

        for (const n of Object.keys(neighbours)) {
            const newCost = cost + neighbours[n];
            const path = edgeMap[n];

            if (!path || newCost < path.cost) {
                edgeMap[n] = { cost: newCost, prev: edge };
                push({ edge: n, cost: newCost }, costsHeap);
            }
        }
    }

    const res = edgeMap[end];
    return res ? [ extractPath(edgeMap, end), res.cost ]
               : undefined;
}

function extractPath(list: Map<{ cost: number, prev?: string }>, end: string) {
    const retval = [];

    for (let curr: string|undefined = end; curr; curr = list[curr]!.prev) {
        retval.unshift(curr);
    }

    return retval;
}

function mkMap<T>(): Map<T> {
    const map = Object.create(null);

    map['__+'] = undefined;
    delete map['__+'];

    return map;
}
