import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { LogOut, Menu, User2, Briefcase, Building2, LayoutDashboard, Home, Search } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { getApiError } from '@/utils/apiError'

const NavLink = ({ to, icon: Icon, label }) => {
    const { pathname } = useLocation()
    const active = pathname === to
    return (
        <Link to={to}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${active ? 'text-[#6A38C2] bg-purple-50' : 'text-gray-600 hover:text-[#6A38C2] hover:bg-purple-50'}`}>
            {Icon && <Icon className='w-4 h-4' />}
            {label}
        </Link>
    )
}

const Navbar = () => {
    const { user } = useSelector(s => s.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true })
            if (res.data.success) {
                dispatch(setUser(null))
                navigate('/')
                toast.success(res.data.message)
            }
        } catch (err) {
            toast.error(getApiError(err))
        }
    }

    const recruiterLinks = [
        { to: '/admin/companies',  icon: Building2,       label: 'Companies'  },
        { to: '/admin/jobs',       icon: Briefcase,       label: 'Jobs'       },
        { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard'  },
    ]
    const studentLinks = [
        { to: '/',       icon: Home,   label: 'Home'   },
        { to: '/jobs',   icon: Briefcase, label: 'Jobs'   },
        { to: '/browse', icon: Search, label: 'Browse' },
    ]
    const links = user?.role === 'recruiter' ? recruiterLinks : studentLinks

    return (
        <nav className='sticky top-0 z-[200] w-full border-b border-white/20 bg-white/80 backdrop-blur-md shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 h-16 flex items-center justify-between'>

                {/* Logo */}
                <Link to='/' className='text-2xl font-bold tracking-tight'>
                    Career<span className='text-[#6A38C2]'>Connect</span>
                    <span className='text-[#F83002]'> Pro</span>
                </Link>

                {/* Desktop Nav */}
                <div className='hidden md:flex items-center gap-1'>
                    {links.map(l => <NavLink key={l.to} {...l} />)}
                </div>

                {/* Right side */}
                <div className='flex items-center gap-3'>
                    {!user ? (
                        <div className='hidden md:flex items-center gap-2'>
                            <Link to='/login'><Button variant='outline' size='sm'>Login</Button></Link>
                            <Link to='/signup'><Button size='sm' className='bg-[#6A38C2] hover:bg-[#5b30a6]'>Sign Up</Button></Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className='cursor-pointer h-9 w-9 ring-2 ring-[#6A38C2]/30 hover:ring-[#6A38C2] transition-all'>
                                    <AvatarImage src={user?.profile?.profilePhoto} />
                                    <AvatarFallback className='bg-[#6A38C2] text-white text-sm'>
                                        {user?.fullname?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className='w-72' align='end'>
                                <div className='flex gap-3 pb-3 border-b'>
                                    <Avatar className='h-10 w-10'>
                                        <AvatarImage src={user?.profile?.profilePhoto} />
                                        <AvatarFallback className='bg-[#6A38C2] text-white'>
                                            {user?.fullname?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='min-w-0'>
                                        <p className='font-semibold text-sm truncate'>{user?.fullname}</p>
                                        <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
                                        <span className='text-xs px-2 py-0.5 rounded-full bg-purple-100 text-[#6A38C2] font-medium capitalize'>
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>
                                <div className='pt-2 space-y-1'>
                                    {user?.role === 'student' && (
                                        <Link to='/profile' className='flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-gray-50 text-gray-700'>
                                            <User2 className='w-4 h-4' /> View Profile
                                        </Link>
                                    )}
                                    <button onClick={logoutHandler}
                                        className='w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-red-50 text-red-600'>
                                        <LogOut className='w-4 h-4' /> Logout
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    {/* Mobile hamburger */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant='ghost' size='icon' className='md:hidden'>
                                <Menu className='h-5 w-5' />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side='right' className='w-72 pt-10'>
                            <div className='flex flex-col gap-2'>
                                {links.map(l => (
                                    <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                                        className='flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2]'>
                                        {l.icon && <l.icon className='w-4 h-4' />} {l.label}
                                    </Link>
                                ))}
                                <hr className='my-2' />
                                {!user ? (
                                    <>
                                        <Link to='/login' onClick={() => setMobileOpen(false)}>
                                            <Button variant='outline' className='w-full'>Login</Button>
                                        </Link>
                                        <Link to='/signup' onClick={() => setMobileOpen(false)}>
                                            <Button className='w-full bg-[#6A38C2]'>Sign Up</Button>
                                        </Link>
                                    </>
                                ) : (
                                    <button onClick={() => { logoutHandler(); setMobileOpen(false) }}
                                        className='flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50'>
                                        <LogOut className='w-4 h-4' /> Logout
                                    </button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
