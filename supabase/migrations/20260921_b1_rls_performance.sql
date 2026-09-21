alter policy profiles_select_self on public.profiles
using (user_id = (select auth.uid()));
alter policy profiles_update_self on public.profiles
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

alter policy projects_select_member on public.projects
using (private.is_project_member(id) or owner_user_id = (select auth.uid()));
alter policy projects_insert_self on public.projects
with check (owner_user_id = (select auth.uid()));
alter policy projects_update_owner on public.projects
using (owner_user_id = (select auth.uid()))
with check (owner_user_id = (select auth.uid()));
alter policy projects_delete_owner on public.projects
using (owner_user_id = (select auth.uid()));

alter policy project_members_insert_owner on public.project_members
with check (
  private.is_project_owner(project_id)
  and (role <> 'owner' or user_id = (select auth.uid()))
);
alter policy project_members_update_owner on public.project_members
using (private.is_project_owner(project_id))
with check (
  private.is_project_owner(project_id)
  and (role <> 'owner' or user_id = (select auth.uid()))
);
alter policy project_members_delete_owner on public.project_members
using (
  private.is_project_owner(project_id)
  and not (role = 'owner' and user_id = (select auth.uid()))
);

drop policy if exists assets_write_member on public.assets;
create policy assets_insert_member on public.assets
for insert to authenticated
with check (private.can_write_project(project_id));
create policy assets_update_member on public.assets
for update to authenticated
using (private.can_write_project(project_id))
with check (private.can_write_project(project_id));
create policy assets_delete_member on public.assets
for delete to authenticated
using (private.can_write_project(project_id));

drop policy if exists asset_relations_write_member on public.asset_relations;
create policy asset_relations_insert_member on public.asset_relations
for insert to authenticated
with check (private.can_write_project(project_id));
create policy asset_relations_update_member on public.asset_relations
for update to authenticated
using (private.can_write_project(project_id))
with check (private.can_write_project(project_id));
create policy asset_relations_delete_member on public.asset_relations
for delete to authenticated
using (private.can_write_project(project_id));

drop policy if exists scan_presets_write_member on public.scan_presets;
create policy scan_presets_insert_member on public.scan_presets
for insert to authenticated
with check (private.can_write_project(project_id));
create policy scan_presets_update_member on public.scan_presets
for update to authenticated
using (private.can_write_project(project_id))
with check (private.can_write_project(project_id));
create policy scan_presets_delete_member on public.scan_presets
for delete to authenticated
using (private.can_write_project(project_id));

drop policy if exists monitors_write_member on public.monitors;
create policy monitors_insert_member on public.monitors
for insert to authenticated
with check (private.can_write_project(project_id));
create policy monitors_update_member on public.monitors
for update to authenticated
using (private.can_write_project(project_id))
with check (private.can_write_project(project_id));
create policy monitors_delete_member on public.monitors
for delete to authenticated
using (private.can_write_project(project_id));

drop policy if exists status_pages_write_member on public.status_pages;
create policy status_pages_insert_member on public.status_pages
for insert to authenticated
with check (private.can_write_project(project_id));
create policy status_pages_update_member on public.status_pages
for update to authenticated
using (private.can_write_project(project_id))
with check (private.can_write_project(project_id));
create policy status_pages_delete_member on public.status_pages
for delete to authenticated
using (private.can_write_project(project_id));

drop policy if exists status_page_components_write_member on public.status_page_components;
create policy status_page_components_insert_member on public.status_page_components
for insert to authenticated
with check (private.can_write_project(project_id));
create policy status_page_components_update_member on public.status_page_components
for update to authenticated
using (private.can_write_project(project_id))
with check (private.can_write_project(project_id));
create policy status_page_components_delete_member on public.status_page_components
for delete to authenticated
using (private.can_write_project(project_id));
