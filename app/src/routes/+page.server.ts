import { type Actions, fail } from '@sveltejs/kit';
import { getStates, upWorkspace, downWorkspace, saveWorkspace, deleteWorkspace } from './ika';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const ps = await getStates()
    return {
        ps
    };
}

export const actions: Actions = {

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

    async save({ request }) {
		const form = await request.formData();
		const workspace = form.get('workspace')?.toString();
        const readme = form.get('readme')?.toString();
        const specification = form.get('specification')?.toString();
        
		if (! workspace || ! readme || ! specification) return fail(400, { message: 'Please specify workspace!' });
        
        const response = await saveWorkspace(workspace, readme, specification)
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