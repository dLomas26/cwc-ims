import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'

const schema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(1, 'Name is required'),
  division: z.string().optional(),
  designation: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  remarks: z.string().optional(),
})

const EmployeeForm = ({ formId, onSubmit, defaultValues, isEdit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  })

  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Employee ID"
          placeholder="e.g. EMP001, A-23, HR-05"
          required
          disabled={isEdit}
          hint={isEdit ? 'Cannot change after creation' : 'Unique ID assigned by admin'}
          error={errors.employee_id?.message}
          {...register('employee_id')}
        />
        <Input
          label="Full Name"
          placeholder="John Doe"
          required
          error={errors.name?.message}
          {...register('name')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Division"
          placeholder="e.g. Engineering, HR, IT"
          error={errors.division?.message}
          {...register('division')}
        />
        <Input
          label="Designation"
          placeholder="e.g. Software Engineer, Manager"
          error={errors.designation?.message}
          {...register('designation')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Mobile"
          placeholder="+91 98765 43210"
          type="tel"
          error={errors.mobile?.message}
          {...register('mobile')}
        />
        <Input
          label="Email"
          placeholder="john@example.com"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <Textarea
        label="Remarks"
        placeholder="Any additional notes..."
        rows={2}
        error={errors.remarks?.message}
        {...register('remarks')}
      />
    </form>
  )
}

export default EmployeeForm
