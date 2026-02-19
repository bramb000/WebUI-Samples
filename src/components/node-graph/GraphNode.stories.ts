import type { Meta, StoryObj } from '@storybook/vue3'
import GraphNode from './GraphNode.vue'
import type { GraphNodeData } from '../../composables/useNodeGraph'

const meta: Meta<typeof GraphNode> = {
    title: 'Node Graph/Components/GraphNode',
    component: GraphNode,
    tags: ['autodocs'],
    argTypes: {
        isRunning: { control: 'boolean' },
        // Events
        onStartDrag: { action: 'startDrag' },
        onStartWireDrag: { action: 'startWireDrag' },
        onPinDrop: { action: 'pinDrop' },
        onUpdateValue: { action: 'updateValue' },
        onOpenExamples: { action: 'openExamples' },
    },
    args: {
        connections: [],
        isRunning: false,
    },
    decorators: [
        () => ({
            template: '<div style="position: relative; height: 300px; width: 100%;"><story/></div>',
        }),
    ],
}

export default meta
type Story = StoryObj<typeof GraphNode>

// Mock Data
const integerNode: GraphNodeData = {
    id: 'node-1',
    type: 'integer',
    label: 'INT',
    value: 42,
    position: { x: 50, y: 50 },
    inputs: [],
    outputs: [{ id: 'p1', label: '', direction: 'output', type: 'number' }],
    execInputs: [],
    execOutputs: [],
    shortDescription: 'An integer',
    detailedInfo: {
        signature: 'INT( value )',
        description: 'Outputs a constant integer value.',
        params: []
    },
    examplesData: undefined,
}

const addNode: GraphNodeData = {
    id: 'node-2',
    type: 'add',
    label: 'ADD',
    position: { x: 50, y: 50 },
    inputs: [
        { id: 'in1', label: 'A', direction: 'input', type: 'number' },
        { id: 'in2', label: 'B', direction: 'input', type: 'number' },
    ],
    outputs: [{ id: 'out1', label: 'Result', direction: 'output', type: 'number' }],
    execInputs: [{ id: 'exIn1', label: '', direction: 'input', type: 'exec' }],
    execOutputs: [{ id: 'exOut1', label: '', direction: 'output', type: 'exec' }],
    shortDescription: 'Adds two numbers',
    detailedInfo: {
        signature: 'ADD( A, B )',
        description: 'Computes the sum of two numbers.',
        params: [
            { name: 'A', description: 'First number' },
            { name: 'B', description: 'Second number' }
        ]
    },
    examplesData: {
        title: 'ADD',
        subtitle: 'Addition',
        notes: ['Connect execution pins to flow control.', 'Inputs A and B are summed.']
    },
}

export const ValueNode: Story = {
    args: {
        node: integerNode,
    },
}

export const FunctionNode: Story = {
    args: {
        node: addNode,
    },
}

export const RunningState: Story = {
    args: {
        node: addNode,
        isRunning: true,
    },
}
