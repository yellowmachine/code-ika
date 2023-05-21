import { type Actions, fail } from '@sveltejs/kit';
import { getStates, upWorkspace, downWorkspace, saveWorkspace, deleteWorkspace } from '../lib/ika';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const ps = await getStates()
    return {
        ps
    };
}

export const actions: Actions = {

	async up({ request }) {
        console.log('up', request)
		const form = await request.formData();
		const workspace = form.get('workspace')?.toString();
		if (! workspace) return fail(400, { message: 'Please specify workspace!' });
        
        await upWorkspace(workspace)
        const ps = await getStates()
        return {
            success: true,
            data: ps
        };
	},

    async down({ request }) {
        console.log('down', request)
		const form = await request.formData();
		const workspace = form.get('workspace')?.toString();
		if (! workspace) return fail(400, { message: 'Please specify workspace!' });

        await downWorkspace(workspace)
        const ps = await getStates()
        return {
            success: true,
            data: ps
        };
	},

    async save({ request }) {
        console.log('save', request)
		const form = await request.formData();
		const workspace = form.get('workspace')?.toString();
        const readme = form.get('readme')?.toString();
        const specification = form.get('specification')?.toString();
        
		if (! workspace || ! readme || ! specification) return fail(400, { message: 'Please specify workspace!' });
        
        await saveWorkspace(workspace, readme, specification)
        const ps = await getStates()
        return {
            success: true,
            data: ps
        };
	},

    async delete({ request }) {
		const form = await request.formData();
		const workspace = form.get('workspace')?.toString();
		if (! workspace) return fail(400, { message: 'Please specify workspace!' });
        
        await deleteWorkspace(workspace)
        const ps = await getStates()
        return {
            success: true,
            data: ps
        };
	},
};