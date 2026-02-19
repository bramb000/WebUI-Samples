import { ref, reactive } from 'vue'

// ─── Types ───────────────────────────────────────────────────────────

export type NodeType = 'integer' | 'add' | 'subtract'

export interface Pin {
    id: string
    label: string
    direction: 'input' | 'output'
    type: 'number' | 'exec'
}

export interface ParamDoc {
    name: string
    description: string
}

export interface DetailedInfo {
    signature: string
    description: string
    params: ParamDoc[]
    examplesLink?: string
}

export interface ExamplesData {
    title: string
    subtitle: string
    notes: string[]
}

export interface GraphNodeData {
    id: string
    type: NodeType
    label: string
    position: { x: number; y: number }
    value?: number
    execInputs: Pin[]
    execOutputs: Pin[]
    inputs: Pin[]
    outputs: Pin[]
    shortDescription: string
    detailedInfo: DetailedInfo
    examplesData?: ExamplesData
}

export interface Connection {
    id: string
    fromNodeId: string
    fromPinId: string
    toNodeId: string
    toPinId: string
}

export interface DragState {
    active: boolean
    nodeId: string | null
    offsetX: number
    offsetY: number
}

export interface WireDragState {
    active: boolean
    fromNodeId: string | null
    fromPinId: string | null
    mouseX: number
    mouseY: number
}

// ─── Header colors by type (Figma spec) ──────────────────────────────

export const NODE_COLORS: Record<NodeType, string> = {
    integer: '#EE4F94',
    add: '#4F8EEE',
    subtract: '#4F8EEE',
}

// ─── Initial nodes ───────────────────────────────────────────────────

function createInitialNodes(): GraphNodeData[] {
    return [
        {
            id: 'int-a',
            type: 'integer',
            label: 'INT',
            position: { x: 60, y: 120 },
            value: 5,
            execInputs: [],
            execOutputs: [],
            inputs: [],
            outputs: [{ id: 'int-a-out', label: '', direction: 'output', type: 'number' }],
            shortDescription: 'An integer',
            detailedInfo: {
                signature: 'INT( value )',
                description: 'Outputs a constant integer value that can be connected to other nodes as input.',
                params: [],
            },
            examplesData: {
                title: 'INT',
                subtitle: 'An integer',
                notes: [
                    'Integer values support whole numbers only.',
                    'To use decimal values, cast to a float or double data type.',
                ],
            },
        },
        {
            id: 'int-b',
            type: 'integer',
            label: 'INT',
            position: { x: 60, y: 310 },
            value: 5,
            execInputs: [],
            execOutputs: [],
            inputs: [],
            outputs: [{ id: 'int-b-out', label: '', direction: 'output', type: 'number' }],
            shortDescription: 'An integer',
            detailedInfo: {
                signature: 'INT( value )',
                description: 'Outputs a constant integer value that can be connected to other nodes as input.',
                params: [],
            },
            examplesData: {
                title: 'INT',
                subtitle: 'An integer',
                notes: [
                    'Integer values support whole numbers only.',
                    'To use decimal values, cast to a float or double data type.',
                ],
            },
        },
        {
            id: 'add',
            type: 'add',
            label: 'ADD',
            position: { x: 350, y: 100 },
            execInputs: [{ id: 'add-exec-in', label: '', direction: 'input', type: 'exec' }],
            execOutputs: [{ id: 'add-exec-out', label: '', direction: 'output', type: 'exec' }],
            inputs: [
                { id: 'add-in1', label: 'Number 1', direction: 'input', type: 'number' },
                { id: 'add-in2', label: 'Number 2', direction: 'input', type: 'number' },
            ],
            outputs: [{ id: 'add-out', label: 'Result', direction: 'output', type: 'number' }],
            shortDescription: 'Add two numbers and output the result',
            detailedInfo: {
                signature: 'ADD( value1, value2 )',
                description: 'Add two numeric values. Automatically detect output type based on inputs.',
                params: [
                    { name: 'value1', description: 'Accepts int, float, double' },
                    { name: 'value2', description: 'Accepts int, float, double' },
                ],
                examplesLink: '#',
            },
            examplesData: {
                title: 'ADD',
                subtitle: 'Add two numbers and output the result',
                notes: [
                    'If the output has a decimal point, the result will automatically be cast to double.',
                    'If both inputs are an integer, the result will automatically be an integer. You can choose to cast it to another data type.',
                ],
            },
        },
        {
            id: 'int-c',
            type: 'integer',
            label: 'INT',
            position: { x: 650, y: 500 },
            value: 50000,
            execInputs: [],
            execOutputs: [],
            inputs: [],
            outputs: [{ id: 'int-c-out', label: '', direction: 'output', type: 'number' }],
            shortDescription: 'An integer',
            detailedInfo: {
                signature: 'INT( value )',
                description: 'Outputs a constant integer value that can be connected to other nodes as input.',
                params: [],
            },
            examplesData: {
                title: 'INT',
                subtitle: 'An integer',
                notes: [
                    'Integer values support whole numbers only.',
                    'To use decimal values, cast to a float or double data type.',
                ],
            },
        },
        {
            id: 'subtract',
            type: 'subtract',
            label: 'SUB',
            position: { x: 920, y: 310 },
            execInputs: [{ id: 'sub-exec-in', label: '', direction: 'input', type: 'exec' }],
            execOutputs: [{ id: 'sub-exec-out', label: '', direction: 'output', type: 'exec' }],
            inputs: [
                { id: 'sub-in1', label: 'Number 1', direction: 'input', type: 'number' },
                { id: 'sub-in2', label: 'Number 2', direction: 'input', type: 'number' },
            ],
            outputs: [{ id: 'sub-out', label: 'Result', direction: 'output', type: 'number' }],
            shortDescription: 'Subtract number 2 from number 1',
            detailedInfo: {
                signature: 'SUB( value1, value2 )',
                description: 'Subtract the second numeric value from the first. Automatically detect output type based on inputs.',
                params: [
                    { name: 'value1', description: 'Accepts int, float, double' },
                    { name: 'value2', description: 'Accepts int, float, double' },
                ],
                examplesLink: '#',
            },
            examplesData: {
                title: 'SUB',
                subtitle: 'Subtract number 2 from number 1',
                notes: [
                    'If the output has a decimal point, the result will automatically be cast to double.',
                    'If both inputs are an integer, the result will automatically be an integer. You can choose to cast it to another data type.',
                ],
            },
        },
    ]
}

function createInitialConnections(): Connection[] {
    return [
        { id: 'conn-1', fromNodeId: 'int-a', fromPinId: 'int-a-out', toNodeId: 'add', toPinId: 'add-in1' },
        { id: 'conn-2', fromNodeId: 'int-b', fromPinId: 'int-b-out', toNodeId: 'add', toPinId: 'add-in2' },
        { id: 'conn-3', fromNodeId: 'add', fromPinId: 'add-out', toNodeId: 'subtract', toPinId: 'sub-in1' },
        { id: 'conn-4', fromNodeId: 'int-c', fromPinId: 'int-c-out', toNodeId: 'subtract', toPinId: 'sub-in2' },
        // Execution flow: ADD runs before SUB
        { id: 'exec-1', fromNodeId: 'add', fromPinId: 'add-exec-out', toNodeId: 'subtract', toPinId: 'sub-exec-in' },
    ]
}

// ─── Composable ──────────────────────────────────────────────────────

export function useNodeGraph() {
    const nodes = ref<GraphNodeData[]>(createInitialNodes())
    const connections = ref<Connection[]>(createInitialConnections())
    const dragState = reactive<DragState>({ active: false, nodeId: null, offsetX: 0, offsetY: 0 })
    const wireDrag = reactive<WireDragState>({ active: false, fromNodeId: null, fromPinId: null, mouseX: 0, mouseY: 0 })
    const executionResult = ref<number | null>(null)
    const isRunning = ref(false)
    const executionError = ref<string | null>(null)

    // ─── Node helpers ────────────────────────────────────────────────

    function getNode(id: string): GraphNodeData | undefined {
        return nodes.value.find((n) => n.id === id)
    }

    function updateNodePosition(id: string, x: number, y: number) {
        const node = getNode(id)
        if (node) {
            node.position.x = x
            node.position.y = y
        }
    }

    function updateNodeValue(id: string, value: number) {
        const node = getNode(id)
        if (node && node.type === 'integer') {
            node.value = value
        }
    }

    // ─── Node drag ───────────────────────────────────────────────────

    function startNodeDrag(nodeId: string, mouseX: number, mouseY: number) {
        const node = getNode(nodeId)
        if (!node) return
        dragState.active = true
        dragState.nodeId = nodeId
        dragState.offsetX = mouseX - node.position.x
        dragState.offsetY = mouseY - node.position.y
    }

    function onNodeDrag(mouseX: number, mouseY: number) {
        if (!dragState.active || !dragState.nodeId) return
        updateNodePosition(dragState.nodeId, mouseX - dragState.offsetX, mouseY - dragState.offsetY)
    }

    function endNodeDrag() {
        dragState.active = false
        dragState.nodeId = null
    }

    // ─── Wire drag ───────────────────────────────────────────────────

    function startWireDrag(nodeId: string, pinId: string, mouseX: number, mouseY: number) {
        wireDrag.active = true
        wireDrag.fromNodeId = nodeId
        wireDrag.fromPinId = pinId
        wireDrag.mouseX = mouseX
        wireDrag.mouseY = mouseY
    }

    function onWireDrag(mouseX: number, mouseY: number) {
        if (!wireDrag.active) return
        wireDrag.mouseX = mouseX
        wireDrag.mouseY = mouseY
    }

    function endWireDrag(targetNodeId?: string, targetPinId?: string) {
        if (wireDrag.active && targetNodeId && targetPinId && wireDrag.fromNodeId && wireDrag.fromPinId) {
            if (canConnect(wireDrag.fromNodeId, wireDrag.fromPinId, targetNodeId, targetPinId)) {
                addConnection(wireDrag.fromNodeId, wireDrag.fromPinId, targetNodeId, targetPinId)
            }
        }
        wireDrag.active = false
        wireDrag.fromNodeId = null
        wireDrag.fromPinId = null
    }

    // ─── Connection CRUD ─────────────────────────────────────────────

    function canConnect(fromNodeId: string, fromPinId: string, toNodeId: string, toPinId: string): boolean {
        if (fromNodeId === toNodeId) return false

        const fromNode = getNode(fromNodeId)
        const toNode = getNode(toNodeId)
        if (!fromNode || !toNode) return false

        // Check in all output collections (data + exec)
        const allFromOutputs = [...fromNode.outputs, ...fromNode.execOutputs]
        const allToInputs = [...toNode.inputs, ...toNode.execInputs]
        const fromPin = allFromOutputs.find((p) => p.id === fromPinId)
        const toPin = allToInputs.find((p) => p.id === toPinId)
        if (!fromPin || !toPin) return false

        // Ensure same type (can't connect exec to data)
        if (fromPin.type !== toPin.type) return false

        const alreadyConnected = connections.value.some((c) => c.toNodeId === toNodeId && c.toPinId === toPinId)
        if (alreadyConnected) return false

        return true
    }

    function addConnection(fromNodeId: string, fromPinId: string, toNodeId: string, toPinId: string) {
        const id = `conn-${Date.now()}`
        connections.value.push({ id, fromNodeId, fromPinId, toNodeId, toPinId })
    }

    function removeConnection(connectionId: string) {
        connections.value = connections.value.filter((c) => c.id !== connectionId)
    }

    // ─── Execution ───────────────────────────────────────────────────

    function evaluate(): number | null {
        isRunning.value = true
        executionError.value = null

        try {
            const nodeMap = new Map<string, GraphNodeData>()
            nodes.value.forEach((n) => nodeMap.set(n.id, n))

            const inDegree = new Map<string, number>()
            const adj = new Map<string, string[]>()
            nodes.value.forEach((n) => {
                inDegree.set(n.id, 0)
                adj.set(n.id, [])
            })

            connections.value.forEach((c) => {
                adj.get(c.fromNodeId)?.push(c.toNodeId)
                inDegree.set(c.toNodeId, (inDegree.get(c.toNodeId) || 0) + 1)
            })

            const queue: string[] = []
            inDegree.forEach((deg, id) => {
                if (deg === 0) queue.push(id)
            })

            const order: string[] = []
            while (queue.length > 0) {
                const id = queue.shift()!
                order.push(id)
                for (const neighbor of adj.get(id) || []) {
                    const newDeg = (inDegree.get(neighbor) || 1) - 1
                    inDegree.set(neighbor, newDeg)
                    if (newDeg === 0) queue.push(neighbor)
                }
            }

            const values = new Map<string, number>()

            for (const nodeId of order) {
                const node = nodeMap.get(nodeId)!

                if (node.type === 'integer') {
                    values.set(node.id, node.value ?? 0)
                } else if (node.type === 'add') {
                    const inputConns = connections.value.filter((c) => c.toNodeId === node.id)
                    const in1Conn = inputConns.find((c) => c.toPinId === 'add-in1')
                    const in2Conn = inputConns.find((c) => c.toPinId === 'add-in2')

                    if (!in1Conn || !in2Conn) {
                        executionError.value = `${node.label}: Missing input connection`
                        return null
                    }

                    const v1 = values.get(in1Conn.fromNodeId) ?? 0
                    const v2 = values.get(in2Conn.fromNodeId) ?? 0
                    values.set(node.id, v1 + v2)
                } else if (node.type === 'subtract') {
                    const inputConns = connections.value.filter((c) => c.toNodeId === node.id)
                    const in1Conn = inputConns.find((c) => c.toPinId === 'sub-in1')
                    const in2Conn = inputConns.find((c) => c.toPinId === 'sub-in2')

                    if (!in1Conn || !in2Conn) {
                        executionError.value = `${node.label}: Missing input connection`
                        return null
                    }

                    const v1 = values.get(in1Conn.fromNodeId) ?? 0
                    const v2 = values.get(in2Conn.fromNodeId) ?? 0
                    values.set(node.id, v1 - v2)
                }
            }

            const result = values.get('subtract') ?? null
            executionResult.value = result

            setTimeout(() => {
                isRunning.value = false
            }, 1500)

            return result
        } catch (e) {
            executionError.value = 'Evaluation failed'
            isRunning.value = false
            return null
        }
    }

    // ─── Shared Geometry Helpers ─────────────────────────────────────

    return {
        dragState,
        wireDrag,
        nodes,
        connections,
        executionResult,
        isRunning,
        executionError,
        startNodeDrag,
        onNodeDrag,
        endNodeDrag,
        startWireDrag,
        onWireDrag,
        endWireDrag,
        addConnection,
        removeConnection,
        updateNodeValue,
        evaluate,
    }
}

// ─── Shared Geometry Helpers ─────────────────────────────────────

/**
 * Returns the {x, y} position of a pin relative to the node's top-left corner.
 * Uses the exact measured constants from the Figma/CSS implementation.
 */
export function getPinRelativePos(node: GraphNodeData, pinId: string): { x: number, y: number } | null {
    // Layout constants (Measured)
    const INT_PIN_X = 143, INT_PIN_Y = 76
    const EXEC_IN_X = 24, EXEC_OUT_X = 345, EXEC_PIN_Y = 75
    const DATA_IN_X = 20, DATA_OUT_X = 349, DATA_PIN_Y0 = 110, DATA_ROW_H = 26

    // 1. Exec Pins
    if (node.execInputs.some(p => p.id === pinId)) return { x: EXEC_IN_X, y: EXEC_PIN_Y }
    if (node.execOutputs.some(p => p.id === pinId)) return { x: EXEC_OUT_X, y: EXEC_PIN_Y }

    // 2. INT Node Data Output
    if (node.type === 'integer') {
        if (node.outputs.some(p => p.id === pinId)) return { x: INT_PIN_X, y: INT_PIN_Y }
        return null
    }

    // 3. ADD/SUB Data Pins
    const outIdx = node.outputs.findIndex(p => p.id === pinId)
    if (outIdx !== -1) {
        return { x: DATA_OUT_X, y: DATA_PIN_Y0 + (outIdx * DATA_ROW_H) }
    }

    const inIdx = node.inputs.findIndex(p => p.id === pinId)
    if (inIdx !== -1) {
        return { x: DATA_IN_X, y: DATA_PIN_Y0 + (inIdx * DATA_ROW_H) }
    }

    return null
}
