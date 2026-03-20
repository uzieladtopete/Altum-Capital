import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  getTeamAdvisors,
  createAdvisor,
  updateAdvisor,
  deleteAdvisor,
  subscribeToAdvisors,
} from '@/services/teamAdvisorsSupabase'
import { uploadImageToCloudinary, validateImageFile } from '@/services/cloudinaryUpload'
import { getOptimizedImageUrl } from '@/config/cloudinary'
import { Pencil, Plus, X, Save, Upload, Loader2 } from 'lucide-react'
import { NativeDelete } from '@/components/ui/delete-button'

const EMPTY_FORM = {
  name: '',
  description: '',
  location: '',
  phone: '',
  email: '',
  image_url: '',
}

function AdvisorForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setUploadError(validation.error)
      return
    }

    setUploadError('')
    setUploading(true)
    try {
      const { secure_url } = await uploadImageToCloudinary(file, () => {})
      set('image_url', secure_url)
    } catch (err) {
      setUploadError(err.message || 'Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave(form)
  }

  const thumbUrl = form.image_url
    ? form.image_url.startsWith('http')
      ? getOptimizedImageUrl(form.image_url, { width: 200 })
      : form.image_url
    : null

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="adv-name">Nombre *</Label>
          <Input id="adv-name" value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="Nombre completo" />
        </div>
        <div>
          <Label htmlFor="adv-email">Correo electrónico</Label>
          <Input id="adv-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="correo@ejemplo.com" />
        </div>
        <div>
          <Label htmlFor="adv-phone">Teléfono</Label>
          <Input id="adv-phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="33 1234 5678" />
        </div>
        <div>
          <Label htmlFor="adv-location">Ubicación</Label>
          <Input id="adv-location" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Guadalajara" />
        </div>
      </div>

      <div>
        <Label htmlFor="adv-desc">Descripción</Label>
        <Textarea id="adv-desc" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Breve descripción del asesor" rows={3} />
      </div>

      <div>
        <Label>Foto de perfil</Label>
        <div className="flex items-center gap-4 mt-1">
          {thumbUrl && (
            <img src={thumbUrl} alt="Preview" className="h-16 w-16 rounded-full object-cover border border-gray-200" />
          )}
          <label className="relative cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Subiendo…' : 'Subir imagen'}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleImageUpload} disabled={uploading} />
          </label>
          {form.image_url && !uploading && (
            <button type="button" onClick={() => set('image_url', '')} className="text-xs text-red-500 hover:text-red-700">
              Quitar
            </button>
          )}
        </div>
        {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          <X className="h-4 w-4 mr-1" /> Cancelar
        </Button>
        <Button type="submit" disabled={saving || !form.name.trim()}>
          {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
          {saving ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}

export default function AdvisorAdminPanel() {
  const [advisors, setAdvisors] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  const fetchAdvisors = useCallback(async () => {
    const data = await getTeamAdvisors()
    setAdvisors(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAdvisors()

    const channel = subscribeToAdvisors(() => {
      fetchAdvisors()
    })

    return () => {
      channel?.unsubscribe()
    }
  }, [fetchAdvisors])

  const handleCreate = async (form) => {
    setSaving(true)
    setError('')
    try {
      await createAdvisor(form)
      setCreating(false)
    } catch (err) {
      setError(err.message || 'Error al crear asesor')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (form) => {
    if (!editingId) return
    setSaving(true)
    setError('')
    try {
      await updateAdvisor(editingId, form)
      setEditingId(null)
    } catch (err) {
      setError(err.message || 'Error al actualizar asesor')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    setError('')
    try {
      await deleteAdvisor(id)
    } catch (err) {
      setError(err.message || 'Error al eliminar asesor')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Administrar Asesores</h3>
          <p className="text-sm text-gray-500 mt-1">Crea, edita o elimina asesores. Los cambios se reflejan en tiempo real.</p>
        </div>
        {!creating && !editingId && (
          <Button onClick={() => { setCreating(true); setError('') }} className="bg-accent hover:bg-accent/90 text-white">
            <Plus className="h-4 w-4 mr-1" /> Nuevo asesor
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {creating && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Nuevo asesor</h4>
          <AdvisorForm onSave={handleCreate} onCancel={() => setCreating(false)} saving={saving} />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : advisors.length === 0 && !creating ? (
        <p className="text-center text-gray-400 py-8">No hay asesores registrados. Crea el primero.</p>
      ) : (
        <div className="space-y-3">
          {advisors.map((adv) => (
            <div key={adv.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {editingId === adv.id ? (
                <div className="p-5">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Editando: {adv.name}</h4>
                  <AdvisorForm
                    initial={{
                      name: adv.name || '',
                      description: adv.description || '',
                      location: adv.location || '',
                      phone: adv.phone || '',
                      email: adv.email || '',
                      image_url: adv.image_url || '',
                    }}
                    onSave={handleUpdate}
                    onCancel={() => setEditingId(null)}
                    saving={saving}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4">
                  <div className="flex-shrink-0">
                    {adv.image_url ? (
                      <img
                        src={adv.image_url.startsWith('http') ? getOptimizedImageUrl(adv.image_url, { width: 100 }) : adv.image_url}
                        alt={adv.name}
                        className="h-14 w-14 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-semibold border border-gray-200">
                        {(adv.name || '?')[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{adv.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {[adv.location, adv.email, adv.phone].filter(Boolean).join(' · ') || 'Sin datos adicionales'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 text-gray-500 hover:text-accent hover:bg-accent/10"
                      onClick={() => { setEditingId(adv.id); setCreating(false); setError('') }}
                      disabled={!!deletingId}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <NativeDelete
                      size="sm"
                      showIcon
                      buttonText=""
                      confirmText=""
                      disabled={deletingId === adv.id || saving}
                      onConfirm={() => {}}
                      onDelete={() => handleDelete(adv.id)}
                      buttonClassName="px-0 w-9 h-9 overflow-hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
