"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/app/contexts/auth-provider"
import { supabase } from "@/lib/supabase"
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Heart, 
  Pill, 
  Shield, 
  User, 
  Calendar,
  Activity,
  Stethoscope,
  AlertTriangle
} from "lucide-react"

interface MedicalRecord {
  id: string
  user_id: string
  type: 'condition' | 'medication' | 'allergy' | 'procedure' | 'lab_result'
  title: string
  description: string
  date: string
  doctor_name?: string
  dosage?: string
  severity?: 'low' | 'moderate' | 'high' | 'critical'
  status: 'active' | 'inactive' | 'resolved'
  created_at: string
  updated_at: string
}

interface VitalSigns {
  id: string
  user_id: string
  date: string
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  heart_rate?: number
  temperature?: number
  weight?: number
  height?: number
  created_at: string
}

export default function MedicalRecordsPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [vitals, setVitals] = useState<VitalSigns[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    type: 'condition' as MedicalRecord['type'],
    title: '',
    description: '',
    date: '',
    doctor_name: '',
    dosage: '',
    severity: 'moderate' as MedicalRecord['severity'],
    status: 'active' as MedicalRecord['status']
  })

  useEffect(() => {
    if (user) {
      fetchMedicalRecords()
      fetchVitalSigns()
    }
  }, [user])

  const fetchMedicalRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecords(data || [])
    } catch (error) {
      console.error('Error fetching medical records:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const fetchVitalSigns = async () => {
    try {
      const { data, error } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(10)

      if (error) throw error
      setVitals(data || [])
    } catch (error) {
      console.error('Error fetching vital signs:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const recordData = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString()
      }

      if (editingRecord) {
        const { error } = await supabase
          .from('medical_records')
          .update(recordData)
          .eq('id', editingRecord.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('medical_records')
          .insert([recordData])
        if (error) throw error
      }

      fetchMedicalRecords()
      resetForm()
    } catch (error) {
      console.error('Error saving medical record:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medical record?')) return

    try {
      const { error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchMedicalRecords()
    } catch (error) {
      console.error('Error deleting medical record:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'condition',
      title: '',
      description: '',
      date: '',
      doctor_name: '',
      dosage: '',
      severity: 'moderate',
      status: 'active'
    })
    setShowAddForm(false)
    setEditingRecord(null)
  }

  const startEdit = (record: MedicalRecord) => {
    setFormData({
      type: record.type,
      title: record.title,
      description: record.description,
      date: record.date,
      doctor_name: record.doctor_name || '',
      dosage: record.dosage || '',
      severity: record.severity || 'moderate',
      status: record.status
    })
    setEditingRecord(record)
    setShowAddForm(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'condition': return <Heart className="w-4 h-4" />
      case 'medication': return <Pill className="w-4 h-4" />
      case 'allergy': return <Shield className="w-4 h-4" />
      case 'procedure': return <Stethoscope className="w-4 h-4" />
      case 'lab_result': return <Activity className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'condition': return 'bg-red-50 text-red-700 border-red-200'
      case 'medication': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'allergy': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'procedure': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'lab_result': return 'bg-purple-50 text-purple-700 border-purple-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'low': return 'bg-green-50 text-green-700 border-green-200'
      case 'moderate': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'critical': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  // Sample data for demonstration
  const sampleRecords: MedicalRecord[] = [
    {
      id: '1',
      user_id: user?.id || '',
      type: 'condition',
      title: 'Hypertension',
      description: 'High blood pressure diagnosed during routine checkup. Currently managed with medication and lifestyle changes.',
      date: '2024-01-15',
      doctor_name: 'Dr. Sarah Johnson',
      severity: 'moderate',
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      user_id: user?.id || '',
      type: 'medication',
      title: 'Lisinopril',
      description: 'ACE inhibitor for blood pressure management',
      date: '2024-01-15',
      doctor_name: 'Dr. Sarah Johnson',
      dosage: '10mg daily',
      severity: 'moderate',
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '3',
      user_id: user?.id || '',
      type: 'allergy',
      title: 'Penicillin Allergy',
      description: 'Severe allergic reaction to penicillin antibiotics. Causes rash and difficulty breathing.',
      date: '2023-08-22',
      doctor_name: 'Dr. Michael Chen',
      severity: 'high',
      status: 'active',
      created_at: '2023-08-22T14:30:00Z',
      updated_at: '2023-08-22T14:30:00Z'
    },
    {
      id: '4',
      user_id: user?.id || '',
      type: 'procedure',
      title: 'Annual Physical Exam',
      description: 'Comprehensive physical examination including blood work, EKG, and routine screenings.',
      date: '2024-01-10',
      doctor_name: 'Dr. Sarah Johnson',
      severity: 'low',
      status: 'resolved',
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-10T09:00:00Z'
    },
    {
      id: '5',
      user_id: user?.id || '',
      type: 'lab_result',
      title: 'Lipid Panel',
      description: 'Total Cholesterol: 195 mg/dL, HDL: 45 mg/dL, LDL: 125 mg/dL, Triglycerides: 150 mg/dL',
      date: '2024-01-08',
      doctor_name: 'Dr. Sarah Johnson',
      severity: 'moderate',
      status: 'active',
      created_at: '2024-01-08T11:15:00Z',
      updated_at: '2024-01-08T11:15:00Z'
    }
  ]

  const sampleVitals: VitalSigns[] = [
    {
      id: '1',
      user_id: user?.id || '',
      date: '2024-01-15',
      blood_pressure_systolic: 138,
      blood_pressure_diastolic: 88,
      heart_rate: 72,
      temperature: 98.6,
      weight: 165,
      height: 70,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      user_id: user?.id || '',
      date: '2024-01-10',
      blood_pressure_systolic: 142,
      blood_pressure_diastolic: 90,
      heart_rate: 75,
      temperature: 98.4,
      weight: 166,
      height: 70,
      created_at: '2024-01-10T09:00:00Z'
    }
  ]

  // Use sample data if no real data exists
  const displayRecords = records.length > 0 ? records : sampleRecords
  const displayVitals = vitals.length > 0 ? vitals : sampleVitals

  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-white">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <DashboardHeader />
            
            <div className="flex-1 flex flex-col">
              {/* Header Bar */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Medical Records</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your health information and medical history</p>
                  </div>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-4 py-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Record
                  </Button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-4">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="conditions">Conditions</TabsTrigger>
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                    <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                            <Heart className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {displayRecords.filter(r => r.type === 'condition' && r.status === 'active').length}
                            </p>
                            <p className="text-sm text-gray-500">Active Conditions</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Pill className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {displayRecords.filter(r => r.type === 'medication' && r.status === 'active').length}
                            </p>
                            <p className="text-sm text-gray-500">Current Medications</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {displayRecords.filter(r => r.type === 'allergy').length}
                            </p>
                            <p className="text-sm text-gray-500">Known Allergies</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Activity className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{displayVitals.length}</p>
                            <p className="text-sm text-gray-500">Vital Records</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Records */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Recent Medical Records</h2>
                        <p className="text-sm text-gray-500 mt-1">Your latest health information</p>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          {displayRecords.slice(0, 5).map((record) => (
                            <div key={record.id} className="group relative bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:bg-white/80 hover:border-gray-300/50 hover:shadow-md transition-all duration-200">
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-gray-50/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                              
                              <div className="relative flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(record.type)}`}>
                                    {getTypeIcon(record.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-semibold text-gray-900 truncate">{record.title}</h3>
                                      <Badge className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(record.type)}`}>
                                        {record.type}
                                      </Badge>
                                      {record.severity && (
                                        <Badge className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(record.severity)}`}>
                                          {record.severity}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{record.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(record.date).toLocaleDateString()}
                                      </span>
                                      {record.doctor_name && (
                                        <span className="flex items-center gap-1">
                                          <User className="w-3 h-3" />
                                          {record.doctor_name}
                                        </span>
                                      )}
                                      {record.dosage && (
                                        <span className="flex items-center gap-1">
                                          <Pill className="w-3 h-3" />
                                          {record.dosage}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2 ml-3">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEdit(record)}
                                    className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 rounded-lg"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDelete(record.id)}
                                    className="h-8 w-8 p-0 border-gray-200 hover:bg-red-50 hover:border-red-200 rounded-lg text-red-600"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="conditions">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Medical Conditions</h2>
                        <p className="text-sm text-gray-500 mt-1">Track your current and past health conditions</p>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          {displayRecords.filter(r => r.type === 'condition').map((record) => (
                            <div key={record.id} className="group relative bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:bg-white/80 hover:border-gray-300/50 hover:shadow-md transition-all duration-200">
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-gray-50/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                              
                              <div className="relative flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <Heart className="w-4 h-4 text-red-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-semibold text-gray-900 truncate">{record.title}</h3>
                                      <Badge className={`text-xs px-2 py-0.5 rounded-full ${record.status === 'active' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                        {record.status}
                                      </Badge>
                                      {record.severity && (
                                        <Badge className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(record.severity)}`}>
                                          {record.severity}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(record.date).toLocaleDateString()}
                                      </span>
                                      {record.doctor_name && (
                                        <span className="flex items-center gap-1">
                                          <User className="w-3 h-3" />
                                          {record.doctor_name}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2 ml-3">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEdit(record)}
                                    className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 rounded-lg"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDelete(record.id)}
                                    className="h-8 w-8 p-0 border-gray-200 hover:bg-red-50 hover:border-red-200 rounded-lg text-red-600"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="medications">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Current Medications</h2>
                        <p className="text-sm text-gray-500 mt-1">Track your prescriptions and dosages</p>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          {displayRecords.filter(r => r.type === 'medication').map((record) => (
                            <div key={record.id} className="group relative bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:bg-white/80 hover:border-gray-300/50 hover:shadow-md transition-all duration-200">
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-gray-50/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                              
                              <div className="relative flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Pill className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-semibold text-gray-900 truncate">{record.title}</h3>
                                      {record.dosage && (
                                        <Badge className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border-blue-200">
                                          {record.dosage}
                                        </Badge>
                                      )}
                                      <Badge className={`text-xs px-2 py-0.5 rounded-full ${record.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                        {record.status}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Started {new Date(record.date).toLocaleDateString()}
                                      </span>
                                      {record.doctor_name && (
                                        <span className="flex items-center gap-1">
                                          <User className="w-3 h-3" />
                                          Prescribed by {record.doctor_name}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2 ml-3">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEdit(record)}
                                    className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 rounded-lg"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDelete(record.id)}
                                    className="h-8 w-8 p-0 border-gray-200 hover:bg-red-50 hover:border-red-200 rounded-lg text-red-600"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="vitals">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Vital Signs</h2>
                        <p className="text-sm text-gray-500 mt-1">Track your vital signs and measurements</p>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          {displayVitals.map((vital) => (
                            <div key={vital.id} className="group relative bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:bg-white/80 hover:border-gray-300/50 hover:shadow-md transition-all duration-200">
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-gray-50/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                              
                              <div className="relative">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                      <Activity className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900">Vital Signs Check</h3>
                                      <p className="text-xs text-gray-500">{new Date(vital.date).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {vital.blood_pressure_systolic && (
                                    <div className="text-center p-2 bg-gray-50/50 rounded-lg">
                                      <p className="text-lg font-bold text-gray-900">
                                        {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}
                                      </p>
                                      <p className="text-xs text-gray-500">Blood Pressure</p>
                                    </div>
                                  )}
                                  {vital.heart_rate && (
                                    <div className="text-center p-2 bg-gray-50/50 rounded-lg">
                                      <p className="text-lg font-bold text-gray-900">{vital.heart_rate}</p>
                                      <p className="text-xs text-gray-500">Heart Rate</p>
                                    </div>
                                  )}
                                  {vital.temperature && (
                                    <div className="text-center p-2 bg-gray-50/50 rounded-lg">
                                      <p className="text-lg font-bold text-gray-900">{vital.temperature}°F</p>
                                      <p className="text-xs text-gray-500">Temperature</p>
                                    </div>
                                  )}
                                  {vital.weight && (
                                    <div className="text-center p-2 bg-gray-50/50 rounded-lg">
                                      <p className="text-lg font-bold text-gray-900">{vital.weight} lbs</p>
                                      <p className="text-xs text-gray-500">Weight</p>
                                    </div>
                                  )}
                                  {vital.height && (
                                    <div className="text-center p-2 bg-gray-50/50 rounded-lg">
                                      <p className="text-lg font-bold text-gray-900">{vital.height}"</p>
                                      <p className="text-xs text-gray-500">Height</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>

        {/* Add/Edit Record Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingRecord ? 'Edit Medical Record' : 'Add New Medical Record'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingRecord ? 'Update your medical information' : 'Add a new entry to your medical records'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as MedicalRecord['type']})}
                      className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    >
                      <option value="condition">Medical Condition</option>
                      <option value="medication">Medication</option>
                      <option value="allergy">Allergy</option>
                      <option value="procedure">Procedure</option>
                      <option value="lab_result">Lab Result</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as MedicalRecord['status']})}
                      className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Hypertension, Lisinopril, Peanut Allergy"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Detailed description of the condition, medication, or procedure"
                    className="mt-1"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="severity">Severity</Label>
                    <select
                      id="severity"
                      value={formData.severity}
                      onChange={(e) => setFormData({...formData, severity: e.target.value as MedicalRecord['severity']})}
                      className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctor_name">Doctor Name (Optional)</Label>
                    <Input
                      id="doctor_name"
                      value={formData.doctor_name}
                      onChange={(e) => setFormData({...formData, doctor_name: e.target.value})}
                      placeholder="e.g., Dr. Sarah Johnson"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dosage">Dosage (For Medications)</Label>
                    <Input
                      id="dosage"
                      value={formData.dosage}
                      onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                      placeholder="e.g., 10mg daily"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                  >
                    {editingRecord ? 'Update Record' : 'Add Record'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1 border-gray-200 hover:bg-gray-50 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </SidebarProvider>
    </ProtectedRoute>
  )
}
