-- Update assign_job_to_worker RPC to add audit logging
CREATE OR REPLACE FUNCTION public.assign_job_to_worker(p_job_id uuid, p_worker_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare 
  ok boolean := false;
begin
  -- Check permission
  if not is_admin_or_owner() then
    raise exception 'Access denied';
  end if;

  update public.jobs
     set assigned_worker_id = p_worker_id,
         assigned_at = now(),
         status = 'assigned',
         pool_enabled = false
   where id = p_job_id
  returning true into ok;

  if ok then
    insert into public.worker_assignments(job_id, worker_id, assigned_by)
    values (p_job_id, p_worker_id, auth.uid());

    insert into public.job_events(job_id, actor, event) 
    values (p_job_id, auth.uid(), 'job.assigned');
    
    -- Log to audit_log (backup logging in case frontend fails)
    insert into public.audit_log(actor, action, target, meta)
    values (
      auth.uid(), 
      'assign_job', 
      p_job_id::text,
      jsonb_build_object(
        'worker_id', p_worker_id,
        'assigned_at', now(),
        'source', 'rpc'
      )
    );
  end if;
  
  return coalesce(ok, false);
end 
$function$;