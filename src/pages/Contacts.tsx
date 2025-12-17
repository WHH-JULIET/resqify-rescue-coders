import { useState } from 'react';
import { Plus, Phone, MapPin, Trash2, Edit2, X, Shield, Star, Bell, Video, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { useUser, Contact } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const relationships = ['Mother', 'Father', 'Spouse', 'Sibling', 'Friend', 'Other'];

export default function Contacts() {
  const { contacts, addContact, updateContact, removeContact, user } = useUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    isBestFriend: false,
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.relationship) {
      toast.error('Please fill in all required fields');
      return;
    }

    const permissions = {
      notifications: formData.isBestFriend,
      calls: formData.isBestFriend,
      liveLocation: formData.isBestFriend,
      audio: formData.isBestFriend,
      video: formData.isBestFriend,
    };

    // Minor safety logic: Mother contact must have best friend mode
    const isMother = formData.relationship === 'Mother';
    const isMinor = user?.isMinor;

    if (editingContact) {
      updateContact(editingContact.id, {
        ...formData,
        isBestFriend: (isMinor && isMother) ? true : formData.isBestFriend,
        permissions: (isMinor && isMother) ? {
          notifications: true,
          calls: true,
          liveLocation: true,
          audio: true,
          video: true,
        } : permissions,
      });
      toast.success('Contact updated');
    } else {
      addContact({
        ...formData,
        isBestFriend: (isMinor && isMother) ? true : formData.isBestFriend,
        permissions: (isMinor && isMother) ? {
          notifications: true,
          calls: true,
          liveLocation: true,
          audio: true,
          video: true,
        } : permissions,
      });
      
      if (isMinor && isMother) {
        toast.info('Best-Friend mode automatically enabled for Mother (Minor Safety)');
      }
      toast.success('Contact added');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', relationship: '', isBestFriend: false });
    setShowAddModal(false);
    setEditingContact(null);
  };

  const openEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      isBestFriend: contact.isBestFriend,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this contact?')) {
      removeContact(id);
      toast.success('Contact removed');
    }
  };

  const toggleBestFriend = (contact: Contact) => {
    // Check if this is a locked mother contact for minors
    if (user?.isMinor && contact.relationship === 'Mother') {
      toast.error('Best-Friend mode is locked for Mother (Minor Safety)');
      return;
    }

    const newBestFriend = !contact.isBestFriend;
    updateContact(contact.id, {
      isBestFriend: newBestFriend,
      permissions: {
        notifications: newBestFriend,
        calls: newBestFriend,
        liveLocation: newBestFriend,
        audio: newBestFriend,
        video: newBestFriend,
      },
    });
    
    toast.success(newBestFriend ? 'Best-Friend mode enabled' : 'Best-Friend mode disabled');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trusted Contacts</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {contacts.length} contact{contacts.length !== 1 ? 's' : ''} added
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            size="icon"
          >
            <Plus size={20} />
          </Button>
        </div>

        {/* Best Friend Info */}
        <div className="card-safety bg-accent/50 mb-6">
          <div className="flex items-start gap-3">
            <Star className="text-primary mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-foreground text-sm">Best-Friend Mode</p>
              <p className="text-xs text-muted-foreground mt-1">
                When enabled, contacts receive continuous live location and all permissions during emergencies.
              </p>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No contacts yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add trusted contacts who will be notified during emergencies
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus size={18} />
              Add Contact
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={cn(
                  'card-safety',
                  contact.isBestFriend && 'ring-2 ring-primary'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center',
                    contact.isBestFriend ? 'bg-primary' : 'bg-accent'
                  )}>
                    <span className="text-lg">
                      {contact.isBestFriend ? '⭐' : '👤'}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground truncate">
                        {contact.name}
                      </p>
                      {contact.isBestFriend && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          Best Friend
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                    <p className="text-sm text-primary mt-1">{contact.phone}</p>
                    
                    {/* Permissions */}
                    {contact.isBestFriend && (
                      <div className="flex gap-2 mt-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Bell size={12} /> <Mic size={12} /> <Video size={12} /> <MapPin size={12} />
                        </div>
                        <span className="text-xs text-safe">All permissions active</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleBestFriend(contact)}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                        contact.isBestFriend
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Star size={16} />
                    </button>
                    <a
                      href={`tel:${contact.phone}`}
                      className="w-8 h-8 rounded-lg bg-safe flex items-center justify-center"
                    >
                      <Phone size={16} className="text-safe-foreground" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEdit(contact)}
                  >
                    <Edit2 size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editingContact ? 'Edit Contact' : 'Add Contact'}
              </h2>
              <button
                onClick={resetForm}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contact name"
                  className="input-safety"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                  className="input-safety"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Relationship *</label>
                <div className="grid grid-cols-3 gap-2">
                  {relationships.map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => setFormData({ ...formData, relationship: rel })}
                      className={cn(
                        'py-2 px-3 rounded-xl text-sm font-medium transition-all',
                        formData.relationship === rel
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-accent'
                      )}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isBestFriend: !formData.isBestFriend })}
                  className={cn(
                    'w-full p-4 rounded-xl flex items-center gap-4 transition-all',
                    formData.isBestFriend
                      ? 'bg-accent border-2 border-primary'
                      : 'bg-secondary border-2 border-transparent'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    formData.isBestFriend ? 'bg-primary' : 'bg-muted'
                  )}>
                    <Star size={20} className={formData.isBestFriend ? 'text-primary-foreground' : 'text-muted-foreground'} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">Best-Friend Mode</p>
                    <p className="text-xs text-muted-foreground">
                      Enable all permissions & live location
                    </p>
                  </div>
                </button>
              </div>
            </div>
            
            <Button onClick={handleSubmit} className="w-full mt-6" size="lg">
              {editingContact ? 'Save Changes' : 'Add Contact'}
            </Button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
