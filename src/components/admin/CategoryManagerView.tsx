import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  Tag,
  Star,
  Coffee,
  Utensils,
  Shirt,
  Wrench,
  Cake,
  ShoppingBag,
} from 'lucide-react';
import { Category } from '../../types';
import { useBusiness } from '../../contexts/BusinessContext';

export const CategoryManagerView: React.FC = () => {
  const { categories, products, activeBusiness, createCategory, updateCategory, deleteCategory } =
    useBusiness();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Tag');
  const [sortOrder, setSortOrder] = useState(1);

  const bizCategories = categories.filter((c) => c.businessId === activeBusiness?.id);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('Tag');
    setSortOrder(bizCategories.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIcon(cat.icon || 'Tag');
    setSortOrder(cat.sortOrder || 1);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !activeBusiness) return;

    if (editingCategory) {
      await updateCategory({
        ...editingCategory,
        name,
        description,
        icon,
        sortOrder: Number(sortOrder) || 1,
      });
    } else {
      await createCategory({
        businessId: activeBusiness.id,
        name,
        description,
        icon,
        sortOrder: Number(sortOrder) || 1,
        isActive: true,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (cat: Category) => {
    const count = products.filter((p) => p.categoryId === cat.id).length;
    if (
      confirm(
        `¿Eliminar categoría "${cat.name}"? Hay ${count} producto(s) en esta categoría.`
      )
    ) {
      await deleteCategory(cat.id, cat.businessId);
    }
  };

  if (!activeBusiness) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-2xl border border-dashed border-slate-300 dark:border-slate-750 space-y-4">
        <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
          <FolderTree className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            Aún no tienes ningún negocio seleccionado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Para organizar categorías, primero debes registrar o seleccionar un negocio en la sección "Mis Negocios".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Categorías de {activeBusiness?.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Organiza los productos y platos en secciones para facilitar la búsqueda al cliente.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="py-2.5 px-4 bg-[#253745] hover:bg-[#1a2630] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bizCategories.map((cat) => {
          const prodCount = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="p-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#253745] dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Orden: #{cat.sortOrder}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed font-normal">
                  {cat.description || 'Sin descripción'}
                </p>

                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {prodCount} {prodCount === 1 ? 'producto' : 'productos'}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pasteles Temáticos, Entradas, Calzado..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción breve (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Deliciosos postres hechos el mismo día"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Posición / Orden de aparición
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#253745] hover:bg-[#1a2630] text-white font-bold rounded-xl shadow transition-all"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
