import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import NotFound from "./components/NotFound/NotFound";
import menuItems from "./MenuItems";
import Spinner from "./components/common/Spinner";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAndLoginWithCustomToken, loadUser } from "./Actions/User";
import "./App.css";
import PendingInvoice from "./components/TaxInvoice/PendingInvoice/PendingInvoice";
import AIChatDrawer from "./components/AIChat/AIChatDrawer";

function App() {
    const dispatch = useDispatch();
    const { loading, authLoading, user } = useSelector(
        (state) => state.userReducer
    );

    useEffect(() => {
        dispatch(checkAndLoginWithCustomToken());
    }, [dispatch]);

    useEffect(() => {
        const handleWheel = (event) => {
            if (event.target.type === "number") {
                event.preventDefault();
            }
        };

        document.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            document.removeEventListener("wheel", handleWheel);
        };
    }, []);

    if (loading || authLoading) {
        return <Spinner type="fullscreen" />;
    }

    return (
        <Fragment>
            <Routes>
                <Route path="/" element={<Home />}>
                    {menuItems.map((item) => (
                        <Route
                            key={item.key}
                            path={item.key}
                            element={item.component}
                        />
                    ))}
                    {menuItems.flatMap((item) => [
                        <Route
                            key={`${item.key}-create`}
                            path={`${item.key}/create`}
                            element={item.changecomponent}
                        />,
                        <Route
                            key={`${item.key}-edit`}
                            path={`${item.key}/edit/:id`}
                            element={item.changecomponent}
                        />,
                        <Route
                            key={`${item.key}-view`}
                            path={`${item.key}/view/:id`}
                            element={item.viewcomponent}
                        />,
                    ])}
                    <Route
                        path="/tax-invoice/pending"
                        element={<PendingInvoice />}
                    />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>

            {/* AI Chat Drawer */}
            <AIChatDrawer />
        </Fragment>
    );
}

export default App;
