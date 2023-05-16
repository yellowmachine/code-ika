import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { getStates, upWorkspace, downWorkspace, createWorkspace, updateWorkspace, deleteWorkspace } from './ika';

export const actions: Actions = {
	async join({ request }) {
        const ps = await getStates()
		return {ps}
	},

	async up({ request }) {
		const form = await request.formData();
		const workspace = form.get('workspace')?.toString();
		if (! workspace) return fail(400, { message: 'Please specify workspace!' });
        
        const response = await upWorkspace(workspace)
        return {response}
	},

    async down({ request }) {
		const form = await request.formData();
		const workspace = form.get('workspace')?.toString();
		if (! workspace) return fail(400, { message: 'Please specify workspace!' });

        const response = await downWorkspace(workspace)
        return {response}
	},

    async create({ request }) {
		const form = await request.formData();
		const workspace = form.get('workspace')?.toString();
        const readme = form.get('readme')?.toString();
        const specification = form.get('specification')?.toString();
        
		if (! workspace || ! readme || ! specification) return fail(400, { message: 'Please specify workspace!' });
        
        const response = await createWorkspace(workspace, readme, specification)
        return {response}
	},

    async update({ request }) {
		const form = await request.formData();
		const workspace = form.get('workspace')?.toString();
        const readme = form.get('readme')?.toString();
        const specification = form.get('specification')?.toString();
        
		if (! workspace || ! readme || ! specification) return fail(400, { message: 'Please specify workspace!' });
        
        const response = await updateWorkspace(workspace, readme, specification)
        return {response}
	},

    async delete({ request }) {
		const form = await request.formData();
		const workspace = form.get('workspace')?.toString();
		if (! workspace) return fail(400, { message: 'Please specify workspace!' });
        
        const response = await deleteWorkspace(workspace)
        return {response}
	},
};