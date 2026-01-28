// ===== TASK RENDERER - All task-related rendering =====
const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
export class RenderTask {
    taskService;
    userService;
    tagService;
    searchService;
    constructor(taskService, userService, tagService, searchService) {
        this.taskService = taskService;
        this.userService = userService;
        this.tagService = tagService;
        this.searchService = searchService;
    }
    render() {
        const searchCriteria = {
            text: document.getElementById('searchTask')?.value || '',
            status: document.getElementById('filterStatus')?.value || '',
            priority: document.getElementById('filterPriority')?.value || '',
            type: document.getElementById('filterType')?.value || '',
            tag: document.getElementById('filterTag')?.value || '',
        };
        const filteredTasks = this.searchService.filterTasks(this.taskService.getTasks(), searchCriteria, this.tagService);
        const taskList = document.getElementById('taskList');
        if (!taskList)
            return;
        taskList.innerHTML = filteredTasks
            .map((t) => this.renderTaskRow(t))
            .join('');
    }
    renderTaskRow(t) {
        const statusColor = t.status === 'Concluído'
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
            : t.status === 'Em Progresso'
                ? 'bg-amber-50 text-amber-600 border-amber-100'
                : 'bg-blue-50 text-blue-600 border-blue-100';
        let priorityColorClass = 'text-slate-400';
        if (t.priority === 'MEDIUM')
            priorityColorClass = 'text-amber-500 font-bold';
        if (t.priority === 'HIGH')
            priorityColorClass = 'text-orange-500 font-bold';
        if (t.priority === 'CRITICAL')
            priorityColorClass = 'text-red-600 font-bold';
        return `
      <tr class="group hover:bg-slate-50 transition-colors border-b border-slate-100">
        <td class="py-4 px-2 cursor-pointer" onclick="window.uiController.openTaskModal(${t.id})">
          <p class="font-bold text-slate-700 ${t.status === 'Concluído' ? 'line-through opacity-40' : ''}">${t.title}</p>
          <span class="text-[8px] ${priorityColorClass} block uppercase tracking-tighter mt-1">${t.type} | ${t.priority || 'LOW'} ${t.deadline ? '| Expira: ' + t.deadline : ''}</span>
        </td>
        <td class="py-4 text-center align-middle">
          <button onclick="event.stopPropagation(); window.uiController.cycleTaskStatus(${t.id})" class="text-[9px] font-bold px-3 py-1.5 rounded-md border min-w-[100px] inline-block ${statusColor}">${t.status.toUpperCase()}</button>
        </td>
        <td class="py-4 text-right pr-2">
          <div class="flex flex-row items-center justify-end gap-1 h-full">
            <select onchange="event.stopPropagation(); window.uiController.manualAssign(${t.id}, this.value)" class="text-[10px] h-6 px-2 rounded-md border bg-white min-w-[100px]">
              <option value="">Atribuir...</option>
              ${this.userService
            .getActiveUsers()
            .map(u => `<option value="${u.email}" ${t.assigned?.includes(u.email) ? 'selected' : ''}>${u.email.split('@')[0]}</option>`)
            .join('')}
            </select>
            <select onchange="event.stopPropagation(); window.uiController.setTaskPriority(${t.id}, this.value)" class="text-[10px] h-6 px-2 rounded-md border bg-white min-w-[70px]">
              ${TASK_PRIORITIES.map(p => `<option value="${p}" ${t.priority === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
            <button onclick="event.stopPropagation(); window.uiController.editTaskTitle(${t.id})" class="text-slate-300 hover:text-indigo-600 p-1.5 rounded-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <button onclick="event.stopPropagation(); window.uiController.deleteTask(${t.id})" class="text-slate-300 hover:text-red-500 p-1.5 rounded-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>`;
    }
}
//# sourceMappingURL=renderTask.js.map